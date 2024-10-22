import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importar useHistory para redirecionamento
import './styles.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const history = useHistory(); // Instância do hook para redirecionar

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5164/api/tutor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login realizado com sucesso:', data);
        history.push('/Home'); // Redireciona para a página de dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      setErrorMessage('Erro ao fazer login. Tente novamente.');
    }
  };


  const handleGoogleLogin = () => {
    console.log("Google login attempted");
    // Lógica de login com Google aqui
  };

  const handleRegisterRedirect = () => {
    history.push('/register'); // Redirecionar para a tela de registro
  };

  return (
    <div className="login-container">
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
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Container para os botões lado a lado */}
      <div className="button-container">
        <button onClick={handleRegisterRedirect} className="register-button">
          Cadastre-se
        </button>

        <button onClick={handleLogin} className="login-button">
          Entrar
        </button>
      </div>

      <button onClick={handleGoogleLogin} className="google-login-button">
        Entrar com o Google
      </button>
    </div>
  );
};

export default Login;
