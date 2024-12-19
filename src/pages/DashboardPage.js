import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard';

function DashboardPage() {
    const handleLogout = () => {
        window.location.href = '/';
    };

    return <Dashboard onLogout={handleLogout} />;
}

export default DashboardPage;
