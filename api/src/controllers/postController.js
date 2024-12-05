const {  Post, CommunityMember} = require('../models')

// Criar um post em uma comunidade
const createPost = async (req, res) => {
  try {
    const  {communityId } = req.params; // Certifique-se de que este valor está sendo extraído corretamente
    const { title, content } = req.body;
    const userId = req.user.id; // Usuário autenticado
    
    console.log('Community ID recebido:', communityId);

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID não fornecido.' });
    }

    // Verifique se o usuário é membro da comunidade
    const isMember = await CommunityMember.findOne({
      where: { userId, communityId },
    });

    if (!isMember) {
      return res.status(403).json({ error: 'Você não é membro desta comunidade.' });
    }

    // Criação do post
    const post = await Post.create({
      title,
      content,
      authorId: userId,
      communityId,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post.' });
  }
};

  

// Obter posts de uma comunidade
const getPostsByCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.findAll({
      where: { communityId: id },
      include: ['user'], // Incluir informações do autor do post
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao obter posts:', error.message);
    res.status(500).json({ error: 'Erro ao obter posts.' });
  }
};

// Atualizar um post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, title } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    if (post.userId !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para atualizar este post.' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Erro ao atualizar post:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar post.' });
  }
};

// Excluir um post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    if (post.userId !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este post.' });
    }

    await post.destroy();

    res.status(200).json({ message: 'Post excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir post:', error.message);
    res.status(500).json({ error: 'Erro ao excluir post.' });
  }
};

module.exports = {
  createPost,
  getPostsByCommunity,
  updatePost,
  deletePost,
};
