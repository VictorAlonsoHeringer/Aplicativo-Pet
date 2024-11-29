import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./styles.css";

const AgendarVacina: React.FC = () => {
  const location = useLocation<{ successMessage?: string }>();
  const history = useHistory();
  const [vacinas, setVacinas] = useState<VacinaDisponivel[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");

  useEffect(() => {
    const fetchVacinas = async () => {
      try {
        const response = await fetch("http://localhost:5164/api/vacinaDisponivel");
        if (!response.ok) throw new Error("Erro ao carregar vacinas disponíveis.");
        const data = await response.json();
        setVacinas(data);
      } catch (error: any) {
        console.error("Erro ao buscar vacinas:", error.message);
        setErrorMessage(error.message || "Erro ao buscar vacinas.");
      }
    };

    fetchVacinas();
  }, []);

  const handleHomeRedirect = () => {
    history.push("/home");
  };

  const handleAgendarRedirect = (vacinaId: string) => {
    history.push(`/agendar/${vacinaId}`);
  };

  return (
    <div className="listar-vacinas">
      <div onClick={handleHomeRedirect} className="back-icon">
        <img src="/images/botao_voltar_verde.svg" alt="Voltar" />
      </div>
      <h1>Vacinas Disponíveis</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="vacinas-list-container">
        <ul className="vacinas-list">
          {vacinas.map((vacina) => (
            <li key={vacina.id} className="vacina-item">
              <h3 className="vacina-nome">{vacina.nome}</h3>
              <p><strong>Tipo:</strong> {vacina.tipo}</p>
              <p><strong>Clínica:</strong> {vacina.clinica}</p>
              <p><strong>Endereço:</strong> {vacina.endereco}</p>
              <p><strong>Veterinário:</strong> {vacina.veterinario}</p>
              <button onClick={() => handleAgendarRedirect(vacina.id)}>Agendar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface VacinaDisponivel {
  id: string;
  nome: string;
  tipo: string;
  clinica: string;
  endereco: string;
  veterinario: string;
}

export default AgendarVacina;
