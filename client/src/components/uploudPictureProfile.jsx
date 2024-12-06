import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/api/users/profile-picture', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      alert('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da foto de perfil:', error);
      alert('Erro ao atualizar a foto de perfil.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Atualizar Foto de Perfil</button>
    </div>
  );
};

export default ProfilePictureUpload;
