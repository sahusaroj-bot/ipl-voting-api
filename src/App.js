import React, { useState } from 'react';
import Login from './components/Login';
import MatchesByDate from './components/MatchesByDate';
import './App.css';

function App() {
    const [token, setToken] = useState('');
    const [name, setName] = useState('');

    if (!token) {
        return <Login setToken={setToken} setName={setName} />;
    }

    return (
        <div className="App">
            <header className="banner">
                <div className="banner-content">
                    <img
                        src="https://i.ibb.co/7WpWH53/images.jpg"
                        alt="Banner Image"
                        className="banner-image"
                    />
                    <h1>Welcome to IPL Voting, {name}!</h1>
                </div>
                <img
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnI5Zzd0YTd3eDFwbXA5dWJobmptNnI3bjlvZzBqZDV2ZHRieGlobSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3rgXBDOAgVBfi2t3QA/giphy.gif" // Example GIF URL
                    alt="Welcome GIF"
                    className="welcome-gif"
                />
            </header>
            <main>
                <MatchesByDate token={token} />
                {/* Add your voting functionality here */}
            </main>
        </div>
    );
}

export default App;
