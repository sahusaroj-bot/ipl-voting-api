import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfoModal from './InfoModal';

const API = process.env.REACT_APP_API_URL;

function Login({ setToken, setName, setUserID }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [resetVerified, setResetVerified] = useState(false);
    const [resetAction, setResetAction] = useState(''); // 'password' or 'username'
    const [showInfoModal, setShowInfoModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (isReset) {
            if (!resetVerified) {
                await handleVerifyTransaction();
            } else {
                await handleReset();
            }
        } else if (isRegister) {
            await handleRegister();
        } else {
            await handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API}/login`,
                { username, password },
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setToken(response.data.accessToken);
            setName(response.data.username);
            setUserID(response.data.userId);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('name', response.data.username);
            localStorage.setItem('userID', response.data.userId);
            localStorage.setItem('role', response.data.role);
            alert(`Login successful! Your User ID is: ${response.data.userId}`);
            navigate('/matches-by-date');
        } catch (error) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Network error, please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            await axios.post(`${API}/register`,
                { username, email, password, transactionId },
                { headers: { 'Content-Type': 'application/json' } }
            );
            alert('Registration successful! Please login with your username.');
            setIsRegister(false);
            setTransactionId('');
        } catch (error) {
            alert(error.response?.data?.error || 'Registration failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyTransaction = async () => {
        try {
            await axios.post(`${API}/verify-transaction`,
                { username, transactionId },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setResetVerified(true);
        } catch (error) {
            alert(error.response?.data?.error || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            const body = { username, transactionId };
            if (resetAction === 'password') body.newPassword = newPassword;
            else body.newUsername = newUsername;

            const response = await axios.post(`${API}/reset`, body,
                { headers: { 'Content-Type': 'application/json' } }
            );
            alert(response.data.message);
            setIsReset(false);
            setResetVerified(false);
            setResetAction('');
            setTransactionId('');
            setNewPassword('');
            setNewUsername('');
        } catch (error) {
            alert(error.response?.data?.error || 'Reset failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">IPL Voting</h1>
                    <p className="text-gray-300">
                        {isReset
                            ? resetVerified
                                ? `Choose what to update`
                                : 'Verify your transaction ID'
                            : isRegister
                            ? 'Create your account to get started'
                            : 'Welcome back! Please sign in to continue'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-gray-200 block">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email - Register only */}
                        {isRegister && (
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-200 block">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Password - Login and Register only */}
                        {!isReset && (
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-200 block">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Transaction ID - Register and Reset (step 1) */}
                        {(isRegister || (isReset && !resetVerified)) && (
                            <div className="space-y-2">
                                <label htmlFor="transactionId" className="text-sm font-medium text-gray-200 block">Transaction ID</label>
                                <input
                                    type="text"
                                    id="transactionId"
                                    placeholder="Enter your transaction ID"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Reset Step 2 - Choose action */}
                        {isReset && resetVerified && !resetAction && (
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setResetAction('password')}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
                                >
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResetAction('username')}
                                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl"
                                >
                                    Update Username
                                </button>
                            </div>
                        )}

                        {/* Reset Step 2 - New Password */}
                        {isReset && resetVerified && resetAction === 'password' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200 block">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Reset Step 2 - New Username */}
                        {isReset && resetVerified && resetAction === 'username' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200 block">New Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter new username"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Submit Button - hide when choosing reset action */}
                        {!(isReset && resetVerified && !resetAction) && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span>
                                    {isReset && !resetVerified ? 'Verify Transaction ID'
                                        : isReset && resetVerified ? 'Update'
                                        : isRegister ? 'Create Account'
                                        : 'Sign In'}
                                </span>
                            )}
                        </button>
                        )}

                        {/* Toggle buttons */}
                        <div className="text-center space-y-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setIsReset(false);
                                    setResetVerified(false);
                                    setResetAction('');
                                    setTransactionId('');
                                }}
                                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm underline block w-full"
                            >
                                {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                            </button>
                            {!isRegister && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsReset(!isReset);
                                        setIsRegister(false);
                                        setResetVerified(false);
                                        setResetAction('');
                                        setTransactionId('');
                                    }}
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm underline block w-full"
                                >
                                    {isReset ? 'Back to login' : 'Forgot username / password?'}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-4">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <a href="/previous-results" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span>Results</span>
                            </a>
                            <span className="text-gray-500">•</span>
                            <button
                                onClick={() => setShowInfoModal(true)}
                                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-1"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Info</span>
                            </button>
                        </div>
                        
                        {/* Admin Login Button */}
                        <div className="mt-4">
                            <button
                                onClick={() => navigate('/admin-login')}
                                className="w-full bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 text-red-200 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Staff Login (Admin / Accountant)</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">
                            Secure login powered by IPL Voting System
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Info Modal */}
            <InfoModal 
                isOpen={showInfoModal} 
                onClose={() => setShowInfoModal(false)} 
            />
        </div>
    );
}

export default Login;