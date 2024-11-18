// AnimalForm.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const AnimalForm: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');

  const handleSaveAnimal = async () => {
    const tutorId = localStorage.getItem('userId'); // Substituir pelo ID do tutor atual
    const animalData = { nome: name, idade: Number(age), raca: breed, tutorId };

    try {
      const response = await fetch('http://localhost:5164/api/animal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      });

      if (response.ok) {
        history.push('/animal-list');
      } else {
        console.error("Erro ao salvar animal");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleListRedirect = () => {
    history.push('/animal-list');
  };

  return (
    <div className="animal-container">
      <button onClick={handleListRedirect} className="back-icon">
        <i className="fas fa-arrow-left"></i>
      </button>
      <h1>Adicionar Novo Animal</h1>
      
      <input
        type="text"
        placeholder="Nome do Animal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Idade"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Raça"
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        className="input-field"
      />

      <button className="home-button" onClick={handleSaveAnimal}>
        Salvar Animal
      </button>
    </div>
  );
};

export default AnimalForm;
