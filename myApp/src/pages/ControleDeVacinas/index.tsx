import React, { useState } from "react";
import "./styles.css";

const ControleDeVacinas: React.FC = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [validade, setValidade] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const veterinarioId = localStorage.getItem("userId");

  const handleCreate = async () => {
    if (!veterinarioId) {
      setErrorMessage("Veterinário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5164/api/vacina", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          tipo,
          validade,
          veterinarioId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar vacina.");
      }

      setNome("");
      setTipo("");
      setValidade("");
      setErrorMessage("");
      alert("Vacina cadastrada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao cadastrar vacina:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="vaccine-control">
      <h1>Controle de Vacinas</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      />
      <input
        type="date"
        placeholder="Validade"
        value={validade}
        onChange={(e) => setValidade(e.target.value)}
      />
      <button onClick={handleCreate}>Cadastrar Vacina</button>
    </div>
  );
};

export default ControleDeVacinas;
