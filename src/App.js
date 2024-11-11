import React, { useState } from 'react';
import LoginForm from './components/Auth/LoginForm';
import UserActions from './components/User/UserActions';
import './styles/App.css';

function App() {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        {token ? (
          <UserActions token={token} onLogout={handleLogout} />
        ) : (
          <LoginForm onLogin={setToken} />
        )}
      </header>
    </div>
  );
}

export default App;
