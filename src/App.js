import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MatchesByDate from './components/MatchesByDate';
import './App.css';

function App() {
    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [userID, setUserID] = useState('');

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} setName={setName} setUserID={setUserID} />} />
                    <Route path="/matches-by-date" element={token ? <MatchesByDate token={token} userID={userID} name={name} /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
