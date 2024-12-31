import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
        try { 
          console.log('API URL:',' https://ipl-voting-management-prod.onrender.com');
          /*
          Local host url
          const response = await axios.post( `http://localhost:8080/login`,  
          */
         const response = await axios.post( `https://ipl-voting-management-prod.onrender.com/login`,
      
            { id, username, password },
             { 
                headers: { 
                    'Content-Type': 'application/json'
                 }
                 } 
                );
      setToken(response.data.token);
      alert('Login successful!');
    } catch (error) {
      alert('Invalid credentials, please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
