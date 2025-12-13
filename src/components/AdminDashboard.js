import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('users');

    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://api.iplvote.co.in/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMatches = async () => {
        try {
            const response = await axios.get('https://api.iplvote.co.in/admin/matches', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    useEffect(() => {
        if (!token || role !== 'ADMIN') {
            navigate('/login');
            return;
        }
        fetchUsers();
        fetchMatches();
    }, [token, role, navigate, fetchUsers, fetchMatches]);

    const addUser = async (userData) => {
        try {
            await axios.post('https://api.iplvote.co.in/admin/users', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            alert('User added successfully');
        } catch (error) {
            alert('Failed to add user');
        }
    };

    const addMatch = async (matchData) => {
        try {
            await axios.post('https://api.iplvote.co.in/admin/matches', matchData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMatches();
            alert('Match added successfully');
        } catch (error) {
            alert('Failed to add match');
        }
    };

    const resetPassword = async (userId, newPassword) => {
        try {
            await axios.post(`https://api.iplvote.co.in/admin/users/${userId}/reset-password`, 
                { newPassword }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Password reset successfully');
        } catch (error) {
            alert('Failed to reset password');
        }
    };

    const setWinner = async (matchId, winnerTeam) => {
        try {
            await axios.post('https://api.iplvote.co.in/admin/set-winner', 
                { match_id: matchId, winnerTeam }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMatches();
            alert('Winner set successfully');
        } catch (error) {
            alert('Failed to set winner');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-lg font-semibold ${
                                activeTab === 'users' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                            }`}
                        >
                            Manage Users
                        </button>
                        <button
                            onClick={() => setActiveTab('matches')}
                            className={`px-6 py-3 rounded-lg font-semibold ${
                                activeTab === 'matches' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                            }`}
                        >
                            Manage Matches
                        </button>
                        <button
                            onClick={() => setActiveTab('winners')}
                            className={`px-6 py-3 rounded-lg font-semibold ${
                                activeTab === 'winners' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                            }`}
                        >
                            Set Winners
                        </button>
                    </div>

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Users Management</h2>
                            
                            {/* Add User Form */}
                            <div className="bg-white/10 p-6 rounded-lg">
                                <h3 className="text-xl text-white mb-4">Add New User</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    addUser({
                                        username: formData.get('username'),
                                        email: formData.get('email'),
                                        password: formData.get('password'),
                                        role: formData.get('role')
                                    });
                                    e.target.reset();
                                }} className="grid grid-cols-2 gap-4">
                                    <input name="username" placeholder="Username" className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300" required />
                                    <input name="email" type="email" placeholder="Email" className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300" required />
                                    <input name="password" type="password" placeholder="Password" className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300" required />
                                    <select name="role" className="p-3 rounded-lg bg-white/20 text-white">
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                    <button type="submit" className="col-span-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg">
                                        Add User
                                    </button>
                                </form>
                            </div>

                            {/* Users List */}
                            <div className="bg-white/10 p-6 rounded-lg">
                                <h3 className="text-xl text-white mb-4">All Users</h3>
                                <div className="space-y-2">
                                    {users.map(user => (
                                        <div key={user.id} className="flex justify-between items-center bg-white/10 p-4 rounded-lg">
                                            <div className="text-white">
                                                <span className="font-semibold">{user.username}</span> - {user.email} ({user.role})
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newPassword = prompt('Enter new password:');
                                                    if (newPassword) resetPassword(user.id, newPassword);
                                                }}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                            >
                                                Reset Password
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Matches Tab */}
                    {activeTab === 'matches' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Matches Management</h2>
                            
                            {/* Add Match Form */}
                            <div className="bg-white/10 p-6 rounded-lg">
                                <h3 className="text-xl text-white mb-4">Add New Match</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    addMatch({
                                        team1: formData.get('team1'),
                                        team2: formData.get('team2'),
                                        match_date: formData.get('matchDate')
                                    });
                                    e.target.reset();
                                }} className="grid grid-cols-2 gap-4">
                                    <input name="team1" placeholder="Team 1" className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300" required />
                                    <input name="team2" placeholder="Team 2" className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300" required />
                                    <input name="matchDate" type="date" className="p-3 rounded-lg bg-white/20 text-white" required />
                                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg">
                                        Add Match
                                    </button>
                                </form>
                            </div>

                            {/* Matches List */}
                            <div className="bg-white/10 p-6 rounded-lg">
                                <h3 className="text-xl text-white mb-4">All Matches</h3>
                                <div className="space-y-2">
                                    {matches.map(match => (
                                        <div key={match.id} className="flex justify-between items-center bg-white/10 p-4 rounded-lg">
                                            <div className="text-white">
                                                <span className="font-semibold">{match.team1} vs {match.team2}</span> - {match.match_date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Winners Tab */}
                    {activeTab === 'winners' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Set Match Winners</h2>
                            
                            <div className="bg-white/10 p-6 rounded-lg">
                                <h3 className="text-xl text-white mb-4">Matches Without Winners</h3>
                                <div className="space-y-4">
                                    {matches.filter(match => !match.winner).map(match => (
                                        <div key={match.id} className="bg-white/10 p-4 rounded-lg">
                                            <div className="text-white mb-3">
                                                <span className="font-semibold">{match.team1} vs {match.team2}</span> - {match.match_date}
                                            </div>
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => setWinner(match.id, match.team1)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                                >
                                                    {match.team1} Wins
                                                </button>
                                                <button
                                                    onClick={() => setWinner(match.id, match.team2)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                                >
                                                    {match.team2} Wins
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/10 p-6 rounded-lg">
                                <h3 className="text-xl text-white mb-4">Completed Matches</h3>
                                <div className="space-y-2">
                                    {matches.filter(match => match.winner).map(match => (
                                        <div key={match.id} className="bg-white/10 p-4 rounded-lg">
                                            <div className="text-white">
                                                <span className="font-semibold">{match.team1} vs {match.team2}</span> - {match.match_date}
                                                <span className="ml-4 text-green-400">Winner: {match.winner}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;