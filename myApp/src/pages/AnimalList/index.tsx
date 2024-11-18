// AnimalList.tsx
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

interface Animal {
  id: string;
  nome: string;
  idade: number;
  raca: string;
}

const AnimalList: React.FC = () => {
  const history = useHistory();
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const tutorId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5164/api/animal/tutor/${tutorId}`);
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error("Erro ao buscar animais:", error);
      }
    };

    fetchAnimals();
  }, []);

  const handleAddAnimal = () => {
    history.push('/animal-form');
  };

  const handleHomeRedirect = () => {
    history.push('/home');
  };

  return (
    <div className="animal-container">
      <button onClick={handleHomeRedirect} className="back-icon">
        <i className="fas fa-arrow-left"></i>
      </button>
      <h1>Meus Animais</h1>
      <p>Aqui estão listados todos os seus animais.</p>

      <div className="animal-list">
        {animals.map(animal => (
          <div key={animal.id} className="animal-item">
            {animal.nome} - {animal.raca} - {animal.idade} anos
          </div>
        ))}
      </div>

      <button className="home-button" onClick={handleAddAnimal}>
        Adicionar Novo Animal
      </button>
    </div>
  );
};

export default AnimalList;
