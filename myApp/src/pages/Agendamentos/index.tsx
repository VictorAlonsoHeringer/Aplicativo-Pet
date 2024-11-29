import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./styles.css";

const Agendamentos: React.FC = () => {
  const history = useHistory();
  const [agendamentos, setAgendamentos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAgendamentos = async () => {
      const tutorId = localStorage.getItem("userId");
      if (!tutorId) {
        setErrorMessage("Usuário não autenticado.");
        return;
      }

      try {
        console.log("Fetching agendamentos for tutorId:", tutorId);
        const response = await fetch(
          `http://localhost:5164/api/agendamentos/${tutorId}`
        );

        console.log("Resposta bruta do servidor:", response);

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          console.error("Erro do servidor:", error);
          throw new Error(error?.message || "Erro ao carregar agendamentos.");
        }

        const data = await response.json();
        console.log("Agendamentos carregados:", data);
        setAgendamentos(data);
      } catch (error: any) {
        console.error("Erro ao carregar agendamentos:", error.message);
        setErrorMessage(error.message || "Erro ao carregar agendamentos.");
      }
    };

    fetchAgendamentos();
  }, []);

  const handleHomeRedirect = () => {
    history.push('/home');
  };

  return (
    <div className="agendamentos-container">
      <div onClick={handleHomeRedirect} className="back-icon">
        <img src="public/images/botao_voltar_verde.svg" alt="Voltar" />
      </div>
      <h1>Meus Agendamentos</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {agendamentos.length === 0 && !errorMessage ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul>
          {agendamentos.map((agendamento: any) => (
            <li key={agendamento.id} className="agendamento-item">
              <p>
                <strong>Animal:</strong> {agendamento.nomeAnimal}
              </p>
              <p>
                <strong>Vacina:</strong> {agendamento.nomeVacina}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(agendamento.data).toLocaleDateString()}
              </p>
              <p>
                <strong>Horário:</strong> {agendamento.horario}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    agendamento.status === "Pendente"
                      ? "status-pendente"
                      : agendamento.status === "Confirmado"
                      ? "status-confirmado"
                      : "status-cancelado"
                  }
                >
                  {agendamento.status || "Aguardando confirmação"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Agendamentos;
