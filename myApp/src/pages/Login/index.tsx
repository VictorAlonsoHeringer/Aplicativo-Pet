import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('tutor'); // 'tutor' ou 'veterinario'
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const endpoint =
        userType === 'tutor'
          ? 'http://localhost:5164/api/tutor/login'
          : 'http://localhost:5164/api/veterinario/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login realizado com sucesso:', data);

        if (userType === 'tutor' && data.tutor) {
          localStorage.setItem('userId', data.tutor.id);
          localStorage.setItem('role', 'tutor');
        } else if (userType === 'veterinario' && data.veterinario) {
          localStorage.setItem('userId', data.veterinario.id);
          localStorage.setItem('role', 'veterinario');
        } else {
          throw new Error('Formato de resposta inválido.');
        }

        history.push('/home');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setErrorMessage('Erro ao fazer login. Tente novamente.');
    }
  };

  const handleRegisterRedirect = () => {
    history.push('/register');
  };

  return (
    <div className="main-container">
      {/* Coluna esquerda: Imagem */}
      <div className="left-column"></div>

      {/* Coluna direita: Formulário de login */}
      <div className="right-column">
        
        <div className="login-container">
        <h1 className="login-title">Login</h1>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="input-field"
          >
            <option value="tutor">Tutor</option>
            <option value="veterinario">Veterinário</option>
          </select>

          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="button-container">
            <button onClick={handleRegisterRedirect} className="register-button">
              Cadastre-se
            </button>
            <button onClick={handleLogin} className="login-button">
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
