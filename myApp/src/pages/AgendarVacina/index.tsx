import React, { useEffect, useState } from "react";
import "./styles.css";

const AgendarVacina: React.FC = () => {
  const [vacinas, setVacinas] = useState<VacinaDisponivel[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedVacina, setSelectedVacina] = useState<VacinaDisponivel | null>(
    null
  );
  const [agendamento, setAgendamento] = useState({
    data: "",
    horario: "",
    nomeAnimal: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    fetchVacinas();
    fetchAnimals();
  }, []);

  const handleAgendar = async () => {
    if (!selectedVacina || !agendamento.data || !agendamento.horario || !agendamento.nomeAnimal) {
      alert("Preencha todos os campos.");
      return;
    }

    const payload = {
      tutorId: localStorage.getItem("userId"), // ID do tutor logado
      nomeTutor: localStorage.getItem("username"), // Nome do tutor logado
      nomeAnimal: agendamento.nomeAnimal, // Nome do animal selecionado
      vacinaId: selectedVacina.id, // ID da vacina selecionada
      data: agendamento.data, // Data do agendamento
      horario: agendamento.horario, // Horário do agendamento
      nomeVacina: selectedVacina.nome, // Nome da vacina
      veterinarioId: selectedVacina.veterinarioId, // ID do veterinário
      enderecoClinica: selectedVacina.endereco, // Endereço da clínica
    };

    console.log("Payload enviado:", payload);

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

      setSuccessMessage("Agendamento realizado com sucesso!");
      setErrorMessage("");
      setSelectedVacina(null);
      setAgendamento({ data: "", horario: "", nomeAnimal: "" });
    } catch (error: any) {
      console.error("Erro ao agendar vacina:", error.message);
      setErrorMessage(error.message || "Erro ao realizar o agendamento.");
    }
  };

  return (
    <div className="agendar-vacina">
      <h1>Vacinas Disponíveis</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ul>
        {vacinas.map((vacina) => (
          <li key={vacina.id}>
            <h3>{vacina.nome}</h3>
            <p>Tipo: {vacina.tipo}</p>
            <p>Clínica: {vacina.clinica}</p>
            <p>Endereço: {vacina.endereco}</p>
            <p>Veterinário: {vacina.veterinario}</p>
            <button onClick={() => setSelectedVacina(vacina)}>Agendar</button>
          </li>
        ))}
      </ul>

      {selectedVacina && (
        <div>
          <h3>Agendar Vacina: {selectedVacina.nome}</h3>
          <label>
            Selecionar Animal:
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
          </label>
          <label>
            Data:
            <input
              type="date"
              value={agendamento.data}
              onChange={(e) =>
                setAgendamento((prev) => ({ ...prev, data: e.target.value }))
              }
            />
          </label>
          <label>
            Horário:
            <input
              type="time"
              value={agendamento.horario}
              onChange={(e) =>
                setAgendamento((prev) => ({ ...prev, horario: e.target.value }))
              }
            />
          </label>
          <button onClick={handleAgendar}>Confirmar Agendamento</button>
          <button onClick={() => setSelectedVacina(null)}>Cancelar</button>
        </div>
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
  idade: number;
  raca: string;
}

export default AgendarVacina;
