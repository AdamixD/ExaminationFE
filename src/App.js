import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import ExamsPage from './pages/ExamsPage';
import ExamFormPage from './pages/ExamFormPage';
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
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/courses" element={isLoggedIn ? <CoursesPage token={localStorage.getItem("token")} /> : <LoginPage onLogin={handleLogin} />} />
                    <Route path="/exams" element={isLoggedIn ? <ExamsPage token={localStorage.getItem("token")} /> : <LoginPage onLogin={handleLogin} />} />
                    <Route path="/add-exam/:type" element={isLoggedIn ? <ExamFormPage /> : <LoginPage onLogin={handleLogin} />} />
                    <Route path="/edit-exam/:examId" element={isLoggedIn ? <ExamFormPage /> : <LoginPage onLogin={handleLogin} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
