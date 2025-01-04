import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MatchByDate.css'; // Import the CSS file

function Login({ setToken ,setName,setUserID}) {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('API URL:', 'https://ipl-voting-management-prod.onrender.com');
            /*
            Local host url
            const response = await axios.post(`http://localhost:8080/login`,
            */
            const response = await axios.post(`https://ipl-voting-management-prod.onrender.com/login`,
            //const response = await axios.post(`http://localhost:8080/login`,
                { id, username, password },
                { 
                    headers: { 
                        'Content-Type': 'application/json' 
                    } 
                }
            );
            setToken(response.data.token);
            setName(username);
            setUserID(id);
           
            alert('Login successful!');
        } catch (error) {
            alert('Invalid credentials, please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="id" className="label">ID:</label>
                    <input
                        type="text"
                        id="id"
                        className="textbox"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username" className="label">Username:</label>
                    <input
                        type="text"
                        id="username"
                        className="textbox"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="textbox"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="button">Login</button>
            </form>
        </div>
    );
}

export default Login;
