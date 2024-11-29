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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      const tutorId = localStorage.getItem('userId');
      
      if (!tutorId) {
        setErrorMessage('Usuário não autenticado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5164/api/animal/tutor/${tutorId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao buscar animais.');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setAnimals(data);
        } else {
          setAnimals([]);
        }

        setErrorMessage(null);
      } catch (error: any) {
        console.error('Erro ao buscar animais:', error.message);
        setErrorMessage(error.message || 'Erro ao carregar animais.');
      } finally {
        setIsLoading(false);
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
    <div className="animal-container-list">
      <div onClick={handleHomeRedirect} className="back-icon">
        <img src="public\images\botao_voltar_verde.svg" alt="Voltar"/>
      </div>
      <h1>Meus Animais</h1>
      <p>Aqui estão listados todos os seus animais cadastrados.</p>

      {isLoading ? (
        <p>Carregando...</p>
      ) : errorMessage ? (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      ) : animals.length > 0 ? (
        <div className="animal-list">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="animal-item"
              onClick={() => history.push(`/animal-form/${animal.id}`)}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <strong>{animal.nome}</strong> - {animal.raca} - {animal.idade} anos
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum animal encontrado.</p>
      )}

      <button className="home-button" onClick={handleAddAnimal}>
        Adicionar Novo Animal
      </button>
    </div>
  );
};

export default AnimalList;
