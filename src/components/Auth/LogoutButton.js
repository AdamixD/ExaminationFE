import { Link } from "react-router-dom";
import React from 'react';
import '../../styles/App.css';

function LogoutButton({ onLogout }) {
  return (
    <Link to='/'>
      <button className="logout-button" onClick={onLogout}>
        Wyloguj się
      </button>
    </Link>
  );
}

export default LogoutButton;
