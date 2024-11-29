import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./styles.css";

const FormVacina: React.FC = () => {
  const { vacinaId } = useParams<{ vacinaId?: string }>();
  const history = useHistory();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [validade, setValidade] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (vacinaId) {
      const fetchVacina = async () => {
        try {
          const response = await fetch(`http://localhost:5164/api/vacina/${vacinaId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao carregar vacina.");
          }

          const data = await response.json();
          setNome(data.nome);
          setTipo(data.tipo);
          const validadeFormatada = new Date(data.validade).toISOString().split("T")[0];
          setValidade(validadeFormatada);
          setIsEditing(true);
        } catch (error: any) {
          console.error("Erro ao carregar vacina:", error.message);
          setErrorMessage(error.message);
        }
      };

      fetchVacina();
    }
  }, [vacinaId]);

  const handleSave = async () => {
    const veterinarioId = localStorage.getItem("userId");
    if (!veterinarioId) {
      setErrorMessage("Veterinário não autenticado.");
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:5164/api/vacina/${vacinaId}`
        : "http://localhost:5164/api/vacina";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
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
        throw new Error(errorData.message || "Erro ao salvar vacina.");
      }

      history.push("/vacina-list");
    } catch (error: any) {
      console.error("Erro ao salvar vacina:", error.message);
      setErrorMessage(error.message);
    }
  };

  const handleListRedirect = () => {
    history.push("/vacina-list");
  };

  return (
    <div className="vaccine-form">
      <div onClick={handleListRedirect} className="back-icon">
        <img src="public/images/botao_voltar_verde.svg" alt="Voltar" />
      </div>
      <h1>{isEditing ? "Editar Vacina" : "Adicionar Nova Vacina"}</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label htmlFor="nome">Nome da Vacina:</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <label htmlFor="tipo">Tipo da Vacina:</label>
        <input
          id="tipo"
          type="text"
          placeholder="Digite o tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <label htmlFor="validade">Data de Validade:</label>
        <input
          id="validade"
          type="date"
          value={validade}
          onChange={(e) => setValidade(e.target.value)}
        />
      <button onClick={handleSave}>
        {isEditing ? "Salvar Alterações" : "Cadastrar Vacina"}
      </button>
    </div>
  );
};

export default FormVacina;
