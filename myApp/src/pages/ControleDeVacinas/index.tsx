import React, { useState, useEffect } from 'react';
import './styles.css';

const ControleDeVacinas: React.FC = () => {
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [validade, setValidade] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const veterinarioId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchVacinas = async () => {
      try {
        const response = await fetch(`http://localhost:5164/api/vacina/veterinario/${veterinarioId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar vacinas.');
        }
        const data = await response.json();
        setVacinas(data);
      } catch (error) {
        console.error('Erro ao carregar vacinas:', error);
        setErrorMessage('Erro ao carregar vacinas.');
      }
    };

    fetchVacinas();
  }, [veterinarioId]);

  const handleCreate = async () => {
    if (!nome || !tipo || !validade) {
      setErrorMessage('Todos os campos são obrigatórios.');
      return;
    }

    if (!veterinarioId) {
      setErrorMessage('ID do veterinário não encontrado.');
      return;
    }

    const vacina = { nome, tipo, validade, veterinarioId };

    try {
      const response = await fetch('http://localhost:5164/api/vacina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacina),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar vacina.');
      }

      const novaVacina = await response.json();
      setVacinas((prevVacinas) => [...prevVacinas, novaVacina]);
      setErrorMessage('');
      setNome('');
      setTipo('');
      setValidade('');
    } catch (error) {
      console.error('Erro ao cadastrar vacina:', error);
      setErrorMessage('Erro ao cadastrar vacina. Verifique os campos e tente novamente.');
    }
  };

  return (
    <div className="controle-de-vacinas">
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

      <h2>Vacinas Cadastradas</h2>
      <ul>
        {vacinas.map((v) => (
          <li key={v.id}>
            {v.nome} - {v.tipo} - {new Date(v.validade).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface Vacina {
  id: string;
  nome: string;
  tipo: string;
  validade: string;
  veterinarioId: string;
}

export default ControleDeVacinas;
