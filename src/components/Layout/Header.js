import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUser } from "../../services/userService";
import "../../styles/Layout.css";

const Header = ({ isLoggedIn, onLogout }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn) {
                const token = localStorage.getItem("token");
                try {
                    const data = await getUser(token);
                    setUser(data);
                    localStorage.setItem('userRole', data.role);
                } catch (err) {
                    setError("Nie udało się pobrać danych użytkownika.");
                }
            }
        };

        fetchUser();
    }, [isLoggedIn]);

    return (
        <header className="header">
            <div className="logo">PW</div>
            <nav>
                {isLoggedIn ? (
                    <>
                        <span className="user-name">
                            {error ? (
                                <span className="error">{error}</span>
                            ) : user ? (
                                `${user.name} ${user.surname}`
                            ) : (
                                "Ładowanie..."
                            )}
                        </span>
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
};

export default Header;
