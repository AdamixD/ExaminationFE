import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const handleLogin = (token) => {
        if (token) {
            localStorage.setItem('token', token);
            onLogin(token);
            navigate('/courses');
        } else {
            console.error("Nie otrzymano tokena!");
        }
    };

    return (
        <div className="login-page">
            <LoginForm onLogin={handleLogin} />
        </div>
    );
}

export default LoginPage;
