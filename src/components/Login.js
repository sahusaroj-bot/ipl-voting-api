import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfoModal from './InfoModal';

const API = process.env.REACT_APP_API_URL;

/* ── tiny helpers ── */
function EyeIcon({ open }) {
    return open
        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
}

function InputField({ label, type = 'text', placeholder, value, onChange, required, icon, rightSlot, hint }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">{label}</label>
            <div className="relative">
                {/* left icon */}
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    {icon}
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoComplete="off"
                    className="w-full pl-10 pr-10 py-3.5 bg-[#1e1e2e] border border-white/15 rounded-xl text-gray-100 text-sm placeholder-gray-600
                               focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:border-orange-500/50
                               hover:border-white/25 transition-all duration-200"
                />
                {/* right slot (eye toggle) */}
                {rightSlot && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                        {rightSlot}
                    </div>
                )}
            </div>
            {hint && <p className="text-xs text-gray-500 pl-1">{hint}</p>}
        </div>
    );
}

function Alert({ type, message }) {
    const styles = type === 'success'
        ? 'bg-green-500/10 border-green-500/30 text-green-300'
        : 'bg-red-500/10 border-red-500/30 text-red-300';
    const icon = type === 'success'
        ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />;
    return (
        <div className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 text-sm ${styles}`}>
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d={icon.props.d} clipRule="evenodd" /></svg>
            <span>{message}</span>
        </div>
    );
}

const TABS = [
    { id: 'login',    label: 'Sign In' },
    { id: 'register', label: 'Register' },
    { id: 'reset',    label: 'Reset Password' },
];

export default function Login({ setToken, setName, setUserID }) {
    const [mode, setMode]               = useState('login');
    const [username, setUsername]       = useState('');
    const [email, setEmail]             = useState('');
    const [password, setPassword]       = useState('');
    const [showPass, setShowPass]       = useState(false);
    const [showNew, setShowNew]         = useState(false);
    const [transactionId, setTxId]      = useState('');
    const [newPassword, setNewPass]     = useState('');
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState('');
    const [success, setSuccess]         = useState('');
    const [showInfoModal, setInfoModal] = useState(false);
    const navigate = useNavigate();

    const clear = () => {
        setUsername(''); setEmail(''); setPassword('');
        setTxId(''); setNewPass('');
        setError(''); setSuccess('');
        setShowPass(false); setShowNew(false);
    };

    const switchMode = (m) => { clear(); setMode(m); };

    const submit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            if (mode === 'login')    await doLogin();
            if (mode === 'register') await doRegister();
            if (mode === 'reset')    await doReset();
        } finally {
            setLoading(false);
        }
    };

    const doLogin = async () => {
        try {
            const res = await axios.post(`${API}/login`, { username, password },
                { headers: { 'Content-Type': 'application/json' } });
            setToken(res.data.accessToken);
            setName(res.data.username);
            setUserID(res.data.userId);
            localStorage.setItem('token',  res.data.accessToken);
            localStorage.setItem('name',   res.data.username);
            localStorage.setItem('userID', res.data.userId);
            localStorage.setItem('role',   res.data.role);
            navigate('/matches-by-date');
        } catch (err) {
            setError(err.response?.data?.error || 'Network error. Please try again.');
        }
    };

    const doRegister = async () => {
        try {
            await axios.post(`${API}/register`,
                { username, email, password, transactionId },
                { headers: { 'Content-Type': 'application/json' } });
            setSuccess('Account created! You can now sign in.');
            switchMode('login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    const doReset = async () => {
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        try {
            await axios.post(`${API}/reset-password`,
                { username, transactionId, newPassword },
                { headers: { 'Content-Type': 'application/json' } });
            setSuccess('Password reset! Please sign in with your new password.');
            switchMode('login');
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed. Please try again.');
        }
    };

    const userIcon    = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    const emailIcon   = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    const lockIcon    = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
    const txIcon      = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

    const eyeBtn = (show, toggle) => (
        <button type="button" onClick={toggle}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1 -mr-1">
            <EyeIcon open={show} />
        </button>
    );

    return (
        <div className="min-h-screen bg-[#0a0a14] flex flex-col lg:flex-row overflow-hidden">

            {/* ── LEFT PANEL (hidden on mobile) ── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
                {/* gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-pink-600/20 to-purple-800/40" />
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(251,146,60,0.15) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 20%, rgba(236,72,153,0.15) 0%, transparent 50%)`
                }} />
                {/* floating circles */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center max-w-sm">
                    {/* logo */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl mb-8 shadow-2xl shadow-orange-500/40">
                        <span className="text-5xl">🏏</span>
                    </div>
                    <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                        IPL<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                            Voting
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed mb-10">
                        Vote for your favourite team, track results and climb the leaderboard.
                    </p>

                    {/* feature pills */}
                    {[
                        { emoji: '🗳️', text: 'Vote on every match' },
                        { emoji: '🏆', text: 'Compete on the leaderboard' },
                        { emoji: '💰', text: 'Win real rewards' },
                    ].map(f => (
                        <div key={f.text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 mb-3 text-left">
                            <span className="text-2xl">{f.emoji}</span>
                            <span className="text-gray-300 font-medium">{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL / full screen on mobile ── */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen lg:min-h-0 px-5 py-10 lg:px-12 lg:py-8 overflow-y-auto">

                {/* mobile logo */}
                <div className="lg:hidden text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl mb-3 shadow-lg shadow-orange-500/30">
                        <span className="text-3xl">🏏</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">IPL Voting</h1>
                    <p className="text-gray-500 text-sm mt-1">2026 Season</p>
                </div>

                <div className="w-full max-w-sm lg:max-w-md">

                    {/* ── Tab switcher ── */}
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
                        {TABS.map(tab => (
                            <button key={tab.id} type="button"
                                onClick={() => switchMode(tab.id)}
                                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200
                                    ${mode === tab.id
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25'
                                        : 'text-gray-500 hover:text-gray-300'
                                    }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Form card ── */}
                    <div className="bg-[#13131f] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">

                        {/* subtitle */}
                        <p className="text-gray-500 text-sm mb-5">
                            {mode === 'login'    && 'Enter your credentials to access your account.'}
                            {mode === 'register' && 'Fill in the details below to create your account.'}
                            {mode === 'reset'    && 'Enter your username, UPI transaction ID and a new password.'}
                        </p>

                        {/* alerts */}
                        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}
                        {error   && <div className="mb-4"><Alert type="error"   message={error}   /></div>}

                        <form onSubmit={submit} className="space-y-4">

                            {/* Username */}
                            <InputField label="Username" placeholder="Enter your username"
                                value={username} onChange={e => setUsername(e.target.value)}
                                required icon={userIcon} />

                            {/* Email — register only */}
                            {mode === 'register' && (
                                <InputField label="Email address" type="email" placeholder="you@example.com"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    required icon={emailIcon} />
                            )}

                            {/* Password — login & register */}
                            {mode !== 'reset' && (
                                <InputField label="Password" type={showPass ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    required icon={lockIcon}
                                    rightSlot={eyeBtn(showPass, () => setShowPass(v => !v))} />
                            )}

                            {/* Transaction ID — register & reset */}
                            {(mode === 'register' || mode === 'reset') && (
                                <InputField label="UPI Transaction ID"
                                    placeholder="e.g. 317522558583"
                                    value={transactionId} onChange={e => setTxId(e.target.value)}
                                    required icon={txIcon}
                                    hint="The transaction ID you used when paying to join." />
                            )}

                            {/* New password — reset only */}
                            {mode === 'reset' && (
                                <InputField label="New Password" type={showNew ? 'text' : 'password'}
                                    placeholder="Min. 6 characters"
                                    value={newPassword} onChange={e => setNewPass(e.target.value)}
                                    required icon={lockIcon}
                                    rightSlot={eyeBtn(showNew, () => setShowNew(v => !v))}
                                    hint="Must be at least 6 characters." />
                            )}

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="w-full mt-2 py-4 bg-gradient-to-r from-orange-500 to-pink-500
                                           hover:from-orange-400 hover:to-pink-400
                                           active:scale-[0.98] text-white font-bold text-base rounded-2xl
                                           shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50
                                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                           flex items-center justify-center gap-2">
                                {loading
                                    ? <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg><span>Please wait…</span></>
                                    : <span>{{ login: 'Sign In →', register: 'Create Account →', reset: 'Reset Password →' }[mode]}</span>
                                }
                            </button>
                        </form>
                    </div>

                    {/* ── Footer links ── */}
                    <div className="mt-6 space-y-3">
                        {/* quick links row */}
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <a href="/previous-results"
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Results
                            </a>
                            <span className="text-gray-700">|</span>
                            <button onClick={() => setInfoModal(true)}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                About
                            </button>
                        </div>

                        {/* staff login */}
                        <button onClick={() => navigate('/admin-login')}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white/4 hover:bg-white/8
                                       border border-white/8 hover:border-white/15 rounded-2xl
                                       text-gray-500 hover:text-gray-300 text-sm font-medium transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Staff Login (Admin / Accountant)
                        </button>
                    </div>
                </div>
            </div>

            <InfoModal isOpen={showInfoModal} onClose={() => setInfoModal(false)} />
        </div>
    );
}
