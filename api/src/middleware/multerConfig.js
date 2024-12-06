const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Caminho para o diretório de upload
const uploadDir = path.join(__dirname, '../images/');

// Certifique-se de que o diretório exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `profilePicture-${uniqueSuffix}${extension}`);
    },
});

// Filtro para tipos de arquivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Apenas JPEG, PNG e GIF são aceitos.'));
    }
};

// Configuração do multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // Limite de 2MB
    },
});

module.exports = upload;
