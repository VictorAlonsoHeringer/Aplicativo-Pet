import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const HomePage: React.FC = () => {
  const history = useHistory();
  const role = localStorage.getItem('role'); // Obtemos o papel do usuário logado (tutor ou veterinário)

  const handleAnimalsManagement = () => {
    history.push('/animal-list'); // Redirecionar para a página de listagem de animais
  };

  const handleVaccineControl = () => {
    history.push('/vacina-list'); // Redirecionar para a página de controle de vacinas
  };

  const handleVaccineHistory = () => {
    history.push('/agendamentos'); // Redirecionar para a página de histórico de agendamentos
  };

  const handleSolicitacoesAgendamento = () => {
    history.push('/solicitacoes-agendamentos'); // Redirecionar para a página de solicitações de agendamentos
  };

  const handleScheduleVaccine = () => {
    history.push('/agendar-vacina'); // Redirecionar para a página de agendar vacina
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    // Redirecionar para a página de login
    history.push('/');
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo!</h1>
      <p>Escolha uma das opções abaixo para começar:</p>

      {/* Opções disponíveis para todos */}
      {role === 'tutor' && (
        <>
          <button className="home-button" onClick={handleAnimalsManagement}>
            Gerenciar Animais
          </button>

          <button className="home-button" onClick={handleScheduleVaccine}>
            Agendar Vacina
          </button>

          <button className="home-button" onClick={handleVaccineHistory}>
            Meus Agendamentos
          </button>
        </>
      )}
      {/* Opções específicas para veterinários */}
      {role === 'veterinario' && (
        <>
          <button className="home-button" onClick={handleVaccineControl}>
            Controle de Vacinas
          </button>
          <button className="home-button" onClick={handleSolicitacoesAgendamento}>
            Solicitações de Agendamento
          </button>
        </>
      )}
      {/* Botão de Logout */}
        <button className="logout-button" onClick={handleLogout}>
          Encerrar Sessão
        </button>
    </div>
  );
};

export default HomePage;
