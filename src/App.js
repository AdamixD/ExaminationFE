import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './styles/global.css';
import './styles/theme.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div id="root">
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />
                        }
                    />
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
