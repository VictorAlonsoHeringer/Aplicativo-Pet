import React, { useEffect, useState } from 'react';
import './styles.css';

interface Vacina {
  id: string;
  nome: string;
  dataDisponivel: string;
  clinica: string;
}

const HistoricoVacinas: React.FC = () => {
  const [historico, setHistorico] = useState<Vacina[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      const tutorId = localStorage.getItem('userId');
      if (!tutorId) {
        setErrorMessage('Usuário não autenticado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5164/api/vacinas/historico/${tutorId}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar histórico de vacinas.');
        }

        const data = await response.json();
        setHistorico(data);
        setErrorMessage('');
      } catch (error: any) {
        setErrorMessage(error.message || 'Erro ao carregar o histórico.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  return (
    <div className="historico-container">
      <h1>Histórico de Vacinas</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : historico.length === 0 ? (
        <p>Nenhum histórico de vacinas encontrado.</p>
      ) : (
        <ul className="historico-list">
          {historico.map((vacina) => (
            <li key={vacina.id} className="historico-item">
              <p><strong>Nome:</strong> {vacina.nome}</p>
              <p><strong>Data:</strong> {new Date(vacina.dataDisponivel).toLocaleDateString()}</p>
              <p><strong>Clínica:</strong> {vacina.clinica}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoricoVacinas;
