import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importar useHistory para redirecionamento
import './styles.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // Instância do hook para redirecionar

  const handleLogin = () => {
    console.log("Login attempted");
    // Lógica de login aqui
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
      <img src="/assets/dog-image.png" alt="dog" className="dog-image" />
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
      <button onClick={handleLogin} className="login-button">
        Entrar
      </button>

      <button onClick={handleRegisterRedirect} className="register-button">
        Cadastre-se
      </button>

      <button onClick={handleGoogleLogin} className="google-login-button">
        Entrar com o Google
      </button>
    </div>
  );
};

export default LoginPage;
