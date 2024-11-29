import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./styles.css";

const AgendarVacinaForm: React.FC = () => {
  const { vacinaId } = useParams<{ vacinaId: string }>();
  const history = useHistory();
  const [selectedVacina, setSelectedVacina] = useState<VacinaDisponivel | null>(
    null
  );
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [agendamento, setAgendamento] = useState({
    data: "",
    horario: "",
    nomeAnimal: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchVacina = async () => {
      try {
        const response = await fetch(`http://localhost:5164/api/vacinaDisponivel/${vacinaId}`);
        if (!response.ok) throw new Error("Erro ao carregar a vacina selecionada.");
        const data = await response.json();
        setSelectedVacina(data);
      } catch (error: any) {
        console.error("Erro ao buscar vacina:", error.message);
        setErrorMessage(error.message || "Erro ao buscar vacina.");
      }
    };

    const fetchAnimals = async () => {
      const tutorId = localStorage.getItem("userId");
      if (!tutorId) {
        setErrorMessage("Usuário não autenticado.");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5164/api/animal/tutor/${tutorId}`
        );
        if (!response.ok) throw new Error("Erro ao carregar animais.");
        const data = await response.json();
        setAnimals(data);
      } catch (error: any) {
        console.error("Erro ao buscar animais:", error.message);
        setErrorMessage(error.message || "Erro ao buscar animais.");
      }
    };

    fetchVacina();
    fetchAnimals();
  }, [vacinaId]);

  const handleAgendar = async () => {
    if (!selectedVacina || !agendamento.data || !agendamento.horario || !agendamento.nomeAnimal) {
      alert("Preencha todos os campos.");
      return;
    }
  
    const payload = {
      tutorId: localStorage.getItem("userId"),
      nomeTutor: localStorage.getItem("username"),
      nomeAnimal: agendamento.nomeAnimal,
      vacinaId: selectedVacina.id,
      data: agendamento.data,
      horario: agendamento.horario,
      nomeVacina: selectedVacina.nome,
      veterinarioId: selectedVacina.veterinarioId,
      enderecoClinica: selectedVacina.endereco,
    };
  
    try {
      const response = await fetch("http://localhost:5164/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao realizar o agendamento.");
      }
  
      // Redireciona para a listagem com a mensagem de sucesso
      history.push({
        pathname: "/agendar-vacina",
        state: { successMessage: "Agendamento realizado com sucesso!" },
      });
    } catch (error: any) {
      console.error("Erro ao agendar vacina:", error.message);
      setErrorMessage(error.message || "Erro ao realizar o agendamento.");
    }
  };  

  const handleListRedirect = (vacinaId: string) => {
    history.push(`/agendar-vacina`);
  };

  return (
<div className="cadastrar-agendamento">
    <div onClick={handleListRedirect} className="back-icon">
        <img src="public/images/botao_voltar_verde.svg" alt="Voltar" />
    </div>
  <h1>Agendar Vacina</h1>
  {errorMessage && <p className="error-message">{errorMessage}</p>}
  {successMessage && <p className="success-message">{successMessage}</p>}
  {selectedVacina && (
    <form className="agendamento-form">
      <h2>{selectedVacina.nome}</h2>
      <label>
        Selecionar Animal:
      </label>
      <select
          value={agendamento.nomeAnimal}
          onChange={(e) =>
            setAgendamento((prev) => ({
              ...prev,
              nomeAnimal: e.target.value,
            }))
          }
        >
          <option value="">Selecione um animal</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.nome}>
              {animal.nome}
            </option>
          ))}
        </select>
      <label>
        Data:
      </label>
      <input
          type="date"
          value={agendamento.data}
          onChange={(e) =>
            setAgendamento((prev) => ({ ...prev, data: e.target.value }))
          }
        />
      <label>
        Horário:
      </label>
      <input
          type="time"
          value={agendamento.horario}
          onChange={(e) =>
            setAgendamento((prev) => ({ ...prev, horario: e.target.value }))
          }
        />
      <button type="button" onClick={handleAgendar}>
        Confirmar Agendamento
      </button>
    </form>
  )}
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
  veterinarioId: string;
}

interface Animal {
  id: string;
  nome: string;
}

export default AgendarVacinaForm;
