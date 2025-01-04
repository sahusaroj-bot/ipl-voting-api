import React, { useState } from 'react';
import Login from './components/Login';
import MatchesByDate from './components/MatchesByDate';
import './App.css';

function App() {
    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [userID, setUserID] = useState('');


    if (!token) {
        return <Login setToken={setToken} setName={setName} setUserID={setUserID} />;
    }

    return (
        <div className="App">
            <header className="banner">
                <div className="banner-content">
                    <img
                        src="https://i.ibb.co/fkkFJd7/ipl-2025-banner.webp"
                        alt="Banner"
                        className="banner-image"
                    />
                    <h1 className='label'> Welcome to IPL Voting, {name}!</h1>
                </div>
                <img
                    src="https://i.ibb.co/fkkFJd7/ipl-2025-banner.webp" // Example GIF URL
                    alt="Welcome GIF"
                    className="welcome-gif"
                />
            </header>
            <main>
                <MatchesByDate token={token} userID={userID} />
                {/* Add your voting functionality here */}
            </main>
        </div>
    );
}

export default App;
