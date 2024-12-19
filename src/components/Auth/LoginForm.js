import React, { useState } from 'react';
import { login } from '../../services/authService';
import '../../styles/LoginForm.css';

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            if (response && response.access_token) {
                onLogin(response.access_token);
                setError(null);
            } else {
                setError('Nieprawidłowe dane logowania.');
            }
        } catch (err) {
            setError('Nieprawidłowe dane logowania.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Zaloguj się</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Wpisz swój email"
                    required
                />
            </div>
            <div className="form-group">
                <label>Hasło:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Wpisz swoje hasło"
                    required
                />
            </div>
            <button type="submit">Zaloguj się</button>
        </form>
    );
}

export default LoginForm;
