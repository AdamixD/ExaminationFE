import React, { useState } from 'react';
import { login } from '../../services/api';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      onLogin(data.access_token);
      setError(null);
    } catch (err) {
      setError('Nieprawidłowy email lub hasło!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Zaloguj się</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginForm;
