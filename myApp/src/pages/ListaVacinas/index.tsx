import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";

interface Vacina {
  id: string;
  nome: string;
  tipo: string;
  validade: string;
  veterinarioId: string;
  clinica: string;
  nomeVeterinario: string;
}

const ListaVacinas: React.FC = () => {
  const history = useHistory();
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVacinas = async () => {
      const veterinarioId = localStorage.getItem("userId");
      if (!veterinarioId) {
        setErrorMessage("Veterinário não autenticado.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5164/api/vacina/veterinario/${veterinarioId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao carregar vacinas.");
        }

        const data = await response.json();
        setVacinas(data);
        setErrorMessage("");
      } catch (error: any) {
        console.error("Erro ao carregar vacinas:", error.message);
        setErrorMessage(error.message || "Erro ao carregar vacinas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacinas();
  }, []);

  const handleHomeRedirect = () => {
    history.push("/home");
  };

  const handleAddVacina = () => {
    history.push("/vacina");
  };

  const handleEditVacina = (vacinaId: string) => {
    history.push(`/vacina/${vacinaId}`);
  };

  return (
    <div className="vaccine-container">
      <div onClick={handleHomeRedirect} className="back-icon">
        <img src="public/images/botao_voltar_verde.svg" alt="Voltar" />
      </div>
      <h1>Controle de Vacinas</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading ? (
        <p>Carregando...</p>
      ) : vacinas.length > 0 ? (
        <div className="vaccine-list">
          {vacinas.map((vacina) => (
            <div
              key={vacina.id}
              className="vaccine-item"
              onClick={() => handleEditVacina(vacina.id)}
            >
              <h2>{vacina.nome}</h2>
              <p><strong>Tipo:</strong> {vacina.tipo}</p>
              <p><strong>Validade:</strong> {new Date(vacina.validade).toLocaleDateString()}</p>
              <p><strong>Clínica:</strong> {vacina.clinica}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma vacina encontrada.</p>
      )}
      <button className="add-button" onClick={handleAddVacina}>
        Adicionar Nova Vacina
      </button>
    </div>
  );
};

export default ListaVacinas;
