import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Layout.css';

function Header({ isLoggedIn, onLogout }) {
    return (
        <header className="header">
            <div className="logo">PW</div>
            <nav>
                {isLoggedIn ? (
                    <>
                        <NavLink to="/dashboard" className="nav-link">
                            Dashboard
                        </NavLink>
                        <button onClick={onLogout} className="logout-button">
                            Wyloguj się
                        </button>
                    </>
                ) : (
                    <NavLink to="/login" className="nav-link">
                        Logowanie
                    </NavLink>
                )}
            </nav>
        </header>
    );
}

export default Header;
