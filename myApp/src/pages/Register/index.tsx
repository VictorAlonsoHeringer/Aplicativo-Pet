import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importar useHistory para redirecionamento
import './styles.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<string>(''); // Usando string vazia como valor inicial
  const history = useHistory(); // Instância do hook para redirecionar

  const handleRegister = () => {
    console.log("Register attempted");
  };

  const handleLoginRedirect = () => {
    history.push('/'); // Redirecionar para a tela de registro
  };

  return (
    <div className="register-container">
      <input
        type="text"
        placeholder="usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="select-field"
      >
        <option value="">Selecione o tipo de conta</option> {/* Valor padrão vazio */}
        <option value="tutor">Tutor</option>
        <option value="clinica">Clínica</option>
      </select>
      <button onClick={handleLoginRedirect} className="register-button">
        Cadastrar
      </button>
    </div>
  );
};

export default RegisterPage;
