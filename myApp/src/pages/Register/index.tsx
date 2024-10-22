import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const RegisterPage: React.FC = () => {
  const [userType, setUserType] = useState<string>(''); // Inicialmente, sem escolha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Para o loader durante a submissão
  const history = useHistory();

  const validateForm = () => {
    if (!username || !password || !email || !telefone || !endereco) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Inicia o loader

    const userData = {
      nome: username,
      senha: password,
      email: email,
      telefone: telefone,
      endereco: endereco,
      tipo: userType,
    };

    try {
      const response = await fetch('http://localhost:5164/api/tutor', { // URL fictícia do backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar. Tente novamente.');
      }

      const data = await response.json();
      console.log('Usuário registrado com sucesso:', data);

      // Redireciona após o sucesso
      history.push('/');
    } catch (error) {
      setErrorMessage('Falha ao registrar. Tente novamente.');
    } finally {
      setLoading(false); // Finaliza o loader
    }
  };

  const handleLoginRedirect = () => {
    history.push('/');
  };

  return (
    <div className="register-container">
      {/* Ícone de Voltar no canto superior esquerdo */}
      <button onClick={handleLoginRedirect} className="back-icon">
        <i className="fas fa-arrow-left"></i>
      </button>

      {userType === '' && (
        <div className="choose-container">
          <h2>Escolha o tipo de cadastro</h2>
          <button onClick={() => handleUserTypeSelection('tutor')} className="user-type-button">
            <i className="fas fa-user"></i> {/* Ícone de tutor */}
            Sou Tutor
          </button>
          <button onClick={() => handleUserTypeSelection('clinica')} className="user-type-button">
            <i className="fas fa-hospital"></i> {/* Ícone de clínica */}
            Sou Clínica
          </button>
        </div>
      )}

      {userType && (
        <div className={`${userType}-form`}>
          <h2>Cadastro de {userType === 'tutor' ? 'Tutor' : 'Clínica'}</h2>
          
          {/* Mensagem de erro */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <input
            type="text"
            placeholder="Nome*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Telefone*"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Endereço*"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Senha*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          {/* Botão de loader */}
          {loading ? (
            <button className="register-button" disabled>
              Cadastrando...
            </button>
          ) : (
            <button onClick={handleRegister} className="register-button">
              Cadastrar {userType === 'tutor' ? 'Tutor' : 'Clínica'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
