import React from 'react';
import '../../styles/App.css';

function LogoutButton({ onLogout }) {
  return (
    <button className="logout-button" onClick={onLogout}>
      Wyloguj się
    </button>
  );
}

export default LogoutButton;
