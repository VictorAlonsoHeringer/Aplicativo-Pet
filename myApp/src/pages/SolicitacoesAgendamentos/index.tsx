import React, { useEffect, useState } from "react";
import "./styles.css";

const SolicitacoesAgendamentos: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      const veterinarioId = localStorage.getItem("userId");
      if (!veterinarioId) {
        setErrorMessage("Usuário não autenticado.");
        return;
      }

      try {
        console.log(`Fetching solicitacoes for VeterinarioId: ${veterinarioId}`);
        const response = await fetch(
          `http://localhost:5164/api/solicitacaoagendamento/${veterinarioId}`
        );

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          console.error("Erro do servidor:", error);
          throw new Error(error?.message || "Erro ao buscar solicitações.");
        }

        const data = await response.json();
        console.log("Solicitações carregadas:", data);
        setSolicitacoes(data);
      } catch (error: any) {
        console.error("Erro ao carregar solicitações:", error.message);
        setErrorMessage(error.message || "Erro ao carregar solicitações.");
      }
    };

    fetchSolicitacoes();
  }, []);

  const handleAprovar = async (id: string) => {
    try {
      console.log(`Aprovando solicitação com ID: ${id}`);
      const response = await fetch(
        `http://localhost:5164/api/solicitacaoagendamento/aprovar/${id}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Erro ao aprovar solicitação.");
      }

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Erro ao aprovar solicitação:", error.message);
      setErrorMessage(error.message || "Erro ao aprovar solicitação.");
    }
  };

  const handleRecusar = async (id: string) => {
    try {
      console.log(`Recusando solicitação com ID: ${id}`);
      const response = await fetch(
        `http://localhost:5164/api/solicitacaoagendamento/recusar/${id}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Erro ao recusar solicitação.");
      }

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Erro ao recusar solicitação:", error.message);
      setErrorMessage(error.message || "Erro ao recusar solicitação.");
    }
  };

  return (
    <div className="solicitacoes-container">
      <h1>Solicitações de Agendamentos</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {solicitacoes.length === 0 ? (
        <p>Nenhuma solicitação de agendamento encontrada.</p>
      ) : (
        <ul>
          {solicitacoes.map((solicitacao) => (
            <li key={solicitacao.id} className="solicitacao-item">
              <p>
                <strong>Nome do Tutor:</strong> {solicitacao.nomeTutor}
              </p>
              <p>
                <strong>Nome do Animal:</strong> {solicitacao.nomeAnimal}
              </p>
              <p>
                <strong>Vacina:</strong> {solicitacao.vacina}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(solicitacao.data).toLocaleDateString()}
              </p>
              <p>
                <strong>Horário:</strong> {solicitacao.horario}
              </p>
              <div className="action-buttons">
                <button
                  className="approve-button"
                  onClick={() => handleAprovar(solicitacao.id)}
                >
                  Aprovar
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleRecusar(solicitacao.id)}
                >
                  Recusar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface Solicitacao {
  id: string;
  nomeTutor: string;
  nomeAnimal: string;
  vacina: string;
  data: string;
  horario: string;
}

export default SolicitacoesAgendamentos;
