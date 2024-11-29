import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const RegisterPage: React.FC = () => {
  const [userType, setUserType] = useState<string>(''); // Inicialmente, sem escolha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado para confirmar a senha
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Para o loader durante a submissão
  const history = useHistory();
  const [clinicas, setClinicas] = useState<string[]>([]);

  const validateForm = () => {
    if (!username || !password || !email || !telefone || !endereco) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
  };

  const handleAddClinica = (novaClinica: string) => {
    if (novaClinica) {
      setClinicas([...clinicas, novaClinica]);
    }
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
      clinicas: userType === 'veterinario' ? clinicas : [],
    };

    try {
      const endpoint =
        userType === 'veterinario'
          ? 'http://localhost:5164/api/veterinario'
          : 'http://localhost:5164/api/tutor';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao registrar. Tente novamente.');
      }

      const data = await response.json();
      console.log('Usuário registrado com sucesso:', data);

      // Redireciona após o sucesso
      history.push('/');
    } catch (error) {
      setErrorMessage(error.message); // Exibir mensagem de erro ao usuário
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
      <div onClick={handleLoginRedirect} className="back-icon">
        <img src="public\images\botao_voltar_verde.svg" alt="Voltar"/>
      </div>

      {userType === '' && (
        <div className="choose-container">
          <h2>Escolha o tipo de cadastro</h2>
          <button onClick={() => handleUserTypeSelection('tutor')} className="tutor-type-button">
          <img src="public\images\carbon_dog-walker.svg" alt="Dog Walker Icon" /> {/* Ícone de tutor */}
            Sou Tutor
          </button>
          <button onClick={() => handleUserTypeSelection('veterinario')} className="veterinario-type-button">
            <img src="public\images\healthicons_doctor-male.svg" alt="Doctor Icon" />
             {/* Ícone de veterinário */}
            Sou Veterinário
          </button>
        </div>
      )}

      {userType === 'veterinario' && (
        <div>
          <input
            type="text"
            placeholder="Nome da Clínica"
            onBlur={(e) => handleAddClinica(e.target.value)}
            className="input-field"
          />
          <ul>
            {clinicas.map((clinica, index) => (
              <li key={index}>{clinica}</li>
            ))}
          </ul>
        </div>
      )}

      {userType && (
        <div className={`${userType}-form`}>
          <h2>Cadastro de {userType === 'tutor' ? 'Tutor' : 'Veterinário'}</h2>
          
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
          <input
            type="password"
            placeholder="Confirme sua senha*"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Novo campo de confirmação de senha
            className="input-field"
          />

          {/* Botão de loader */}
          {loading ? (
            <button className="register-button" disabled>
              Cadastrando...
            </button>
          ) : (
            <button onClick={handleRegister} className="register-button">
              Cadastrar {userType === 'tutor' ? 'Tutor' : 'Veterinário'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
