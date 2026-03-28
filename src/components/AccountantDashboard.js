import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function AccountantDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [newTransactionId, setNewTransactionId] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/accountant/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [token]);

    useEffect(() => {
        if (!token || role !== 'ACCOUNTANT') {
            navigate('/login');
            return;
        }
        fetchTransactions();
    }, [token, role, navigate, fetchTransactions]);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/accountant/transactions`,
                { transactionId: newTransactionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Transaction ID added successfully');
            setNewTransactionId('');
            fetchTransactions();
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to add transaction ID');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Accountant Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Add Transaction Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Add Transaction ID</h2>
                    <form onSubmit={handleAddTransaction} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Enter Transaction ID"
                            value={newTransactionId}
                            onChange={(e) => setNewTransactionId(e.target.value)}
                            className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg"
                        >
                            Add
                        </button>
                    </form>
                    {message && (
                        <p className={`mt-3 text-sm font-medium ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {message}
                        </p>
                    )}
                </div>

                {/* Transactions List */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">All Transactions</h2>
                    {transactions.length === 0 ? (
                        <p className="text-gray-300">No transactions added yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs uppercase text-gray-400 border-b border-white/20">
                                    <tr>
                                        <th className="py-3 px-4">Transaction ID</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Used By</th>
                                        <th className="py-3 px-4">Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-white/10 hover:bg-white/5">
                                            <td className="py-3 px-4 font-mono text-white">{tx.transactionId}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.used ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                                                    {tx.used ? 'Used' : 'Available'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{tx.usedBy || '—'}</td>
                                            <td className="py-3 px-4">{tx.createdBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountantDashboard;
