import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const HomePage: React.FC = () => {
  const history = useHistory();

  const handleAnimalsManagement = () => {
    history.push('/animal-list'); // Redirecionar para a página de listagem de animais
  };

  const handleVaccineHistory = () => {
    console.log("Histórico de Vacinas");
    // Navegar para a página de histórico de vacinas
  };

  const handleSettings = () => {
    console.log("Configurações");
    // Navegar para a página de configurações
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo!</h1>
      <p>Escolha uma das opções abaixo para começar:</p>
      
      <button className="home-button" onClick={handleAnimalsManagement}>
        Gerenciar Animais
      </button>

      <button className="home-button" onClick={handleVaccineHistory}>
        Histórico de Vacinas
      </button>

      <button className="home-button" onClick={handleSettings}>
        Configurações
      </button>
    </div>
  );
};

export default HomePage;
