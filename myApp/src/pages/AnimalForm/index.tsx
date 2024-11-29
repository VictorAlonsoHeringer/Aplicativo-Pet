import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './styles.css';

const AnimalForm: React.FC = () => {
  const { animalId } = useParams<{ animalId?: string }>();
  const history = useHistory();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Se houver um animalId, estamos no modo de edição
    if (animalId) {
      const fetchAnimal = async () => {
        try {
          const response = await fetch(`http://localhost:5164/api/animal/${animalId}`);
          if (!response.ok) {
            throw new Error('Erro ao carregar os dados do animal.');
          }
          const data = await response.json();
          setName(data.nome);
          setAge(data.idade.toString());
          setBreed(data.raca);
          setIsEditing(true);
        } catch (error) {
          console.error('Erro ao carregar os dados do animal:', error);
        }
      };

      fetchAnimal();
    }
  }, [animalId]);

  const handleSaveAnimal = async () => {
    const tutorId = localStorage.getItem('userId');
    const animalData = { nome: name, idade: Number(age), raca: breed, tutorId };

    try {
      const url = isEditing
        ? `http://localhost:5164/api/animal/${animalId}` // Atualizar o animal
        : 'http://localhost:5164/api/animal'; // Criar novo animal

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      });

      if (response.ok) {
        history.push('/animal-list');
      } else {
        console.error('Erro ao salvar animal');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleDeleteAnimal = async () => {
    if (!animalId) return;

    try {
      const response = await fetch(`http://localhost:5164/api/animal/${animalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        history.push('/animal-list');
      } else {
        console.error('Erro ao deletar animal');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleListRedirect = () => {
    history.push('/animal-list');
  };

  return (
    <div className="animal-container">
      <div onClick={handleListRedirect} className="back-icon">
        <img src="public/images/botao_voltar_verde.svg" alt="Voltar" />
      </div>
      <h1>{isEditing ? 'Editar Animal' : 'Adicionar Novo Animal'}</h1>

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
        {isEditing ? 'Salvar Alterações' : 'Salvar Animal'}
      </button>
      {isEditing && (
        <button className="home-button delete-button" onClick={handleDeleteAnimal}>
          Deletar Animal
        </button>
      )}
    </div>
  );
};

export default AnimalForm;
