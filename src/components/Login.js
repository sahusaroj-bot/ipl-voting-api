import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/MatchByDate.css';
import '../styles/loginPage.css';
import '../styles/loginButton.css';

function Login({ setToken, setName, setUserID }) {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
             const response = await axios.post('https://ipl-voting-management-prod.onrender.com/login',
                 //const response = await axios.post('http://localhost:8080/login',
                { id, username, password },
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Save token, username, and userID to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', username);
            localStorage.setItem('userID', id);

            // Update state with retrieved values
            setToken(response.data.token);
            setName(username);
            setUserID(id);

            alert('Login successful!');
            navigate('/matches-by-date'); // Redirect to MatchesByDate page
        } catch (error) {
            if (error.response) {
                alert('Invalid credentials, please try again.');
            } else {
                alert('Network error, please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-1xl font-bold">IPL Voting</div>
                    <div>
                        <a href="#previous-results" className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">Previous Results</a>
                        <a href="#information" className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">Information</a>
                    </div>
                </div>
            </nav>
            <div className="flex items-center justify-center py-10">
                <div className="login-container w-full max-w-sm p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
                    <form onSubmit={handleSubmit} className="login-form mt-4">
                        <div className="form-group mb-4">
                            <input
                                type="text"
                                id="id"
                                placeholder="UserID"
                                aria-label="UserID"
                                className="textbox w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="text"
                                id="username"
                                className="textbox w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                                placeholder="UserName/name"
                                aria-label="UserName"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                id="password"
                                className="textbox w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
                                placeholder="Password"
                                aria-label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="submit w-full px-3 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-200" disabled={loading}>
                            {loading ? 'Loading...' : (
                                <div>
                                    <div className="original">Login</div>
                                    <div className="letters">
                                        <span>L</span>
                                        <span>O</span>
                                        <span>G</span>
                                        <span>I</span>
                                        <span>N</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
