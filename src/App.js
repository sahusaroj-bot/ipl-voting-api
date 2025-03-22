import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MatchesByDate from './components/MatchesByDate';

function App() {
    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [userID, setUserID] = useState('');
    const [loading, setLoading] = useState(true); // New state to handle loading

    useEffect(() => {
        // Check localStorage for token, name, and userID
        const savedToken = localStorage.getItem('token');
        const savedName = localStorage.getItem('name');
        const savedUserID = localStorage.getItem('userID');

        if (savedToken) {
            setToken(savedToken);
            setName(savedName || '');
            setUserID(savedUserID || '');
        }

        setLoading(false); // Set loading to false after data retrieval
    }, []);

    // Show a loading indicator or nothing until useEffect finishes
    if (loading) {
        return <div>Loading...</div>; // Or add a spinner/placeholder here
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={<Login setToken={setToken} setName={setName} setUserID={setUserID} />}
                    />
                    <Route
                        path="/matches-by-date"
                        element={token ? (
                            <MatchesByDate token={token} userID={userID} name={name} />
                        ) : (
                            <Navigate to="/login" />
                        )}
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
