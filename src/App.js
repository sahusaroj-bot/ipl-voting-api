import React, { useState } from 'react';
import Login from './components/Login';
import MatchesByDate from './components/MatchesByDate';
import './App.css';

function App() {
  const [token, setToken] = useState('');

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="App">
      <h1>Welcome to IPL Voting App</h1>
      <p>Your token: {token}</p>
      <MatchesByDate token={token} />
      {/* Add your voting functionality here */}
    </div>
  );
}

export default App;
