import React, { useState } from 'react';
import axios from 'axios';
import './AddFriend.css';

const AddFriend = ({ userId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');


    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/search?query=${searchTerm}`);
            console.log('Busca:', searchTerm);
            console.log('Resposta da API:', response.data);
            setSearchResults(response.data.users); // Atualize com os usuários
            setError('');
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            setError('Erro ao buscar usuários.');
            setSearchResults([]);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            console.log(userId, friendId);
            await axios.post(`http://localhost:3000/api/users/${userId}/friends`, { friendId });
            alert('Amigo adicionado com sucesso!');
            setSearchResults((prev) => prev.filter((user) => user.id !== friendId)); // Remove o amigo adicionado da lista
        } catch (error) {
            console.error('Erro ao adicionar amigo:', error);
            setError('Erro ao adicionar amigo.');
        }
    };

    return (
        <div className="add-friend-container">
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por username..."
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            {error && <p className="add-friend-error">{error}</p>}
            {searchResults.length > 0 ? (
                <ul className="search-results">
                    {searchResults.map((user) => (
                        <li key={user.id}>
                            <strong>{user.username}</strong> - {user.email}
                            <button onClick={() => handleAddFriend(user.id)}>Adicionar</button>
                        </li>
                    ))}
                </ul>
            ) : (
                searchTerm && !error && <p className="no-results-message">Nenhum usuário encontrado.</p>
            )}
        </div>
    );


};

export default AddFriend;
