import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MatchesByDate from './components/MatchesByDate';
import './App.css';

function App() {
    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [userID, setUserID] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage on page refresh
        const savedToken = localStorage.getItem('token');
        const savedName = localStorage.getItem('name');
        const savedUserID = localStorage.getItem('userID');

        if (savedToken) {
            setToken(savedToken);
            setName(savedName || '');
            setUserID(savedUserID || '');
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} setName={setName} setUserID={setUserID} />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/matches-by-date" element={token ? <MatchesByDate token={token} userID={userID} name={name} /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
