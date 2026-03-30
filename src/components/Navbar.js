import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
    {
        to: '/matches-by-date',
        label: 'Home',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        to: '/leaderboard',
        label: 'Leaderboard',
        icon: <span className="text-sm">🏆</span>,
        highlight: true,
    },
    {
        to: '/previous-results',
        label: 'Results',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        to: '/today-votes',
        label: "Today's Votes",
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
        ),
    },
];

export default function Navbar({ money }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const name = localStorage.getItem('name') || '';

    const handleLogout = () => {
        ['token', 'userID', 'name', 'role'].forEach(k => localStorage.removeItem(k));
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="relative z-20 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-xl">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Brand */}
                    <button onClick={() => navigate('/matches-by-date')}
                        className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                            <span className="text-lg">🏏</span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-white font-bold text-sm leading-none">IPL Voting</p>
                            <p className="text-gray-400 text-xs">2025 Season</p>
                        </div>
                    </button>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(link => (
                            <button key={link.to} onClick={() => navigate(link.to)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isActive(link.to)
                                        ? 'bg-white/20 text-white shadow-inner'
                                        : link.highlight
                                            ? 'text-yellow-300 hover:bg-yellow-500/15 hover:text-yellow-200'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}>
                                {link.icon}
                                {link.label}
                                {isActive(link.to) && (
                                    <span className="w-1 h-1 rounded-full bg-orange-400 ml-0.5" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right side: wallet + user + logout */}
                    <div className="flex items-center gap-2">
                        {/* Wallet chip */}
                        <div className="hidden sm:flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-xl px-3 py-1.5">
                            <span className="text-green-400 text-sm">₹</span>
                            <span className="text-green-300 font-bold text-sm">
                                {typeof money === 'number' ? money.toFixed(2) : money || '0.00'}
                            </span>
                        </div>

                        {/* User avatar + name */}
                        <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-white text-sm font-medium max-w-[80px] truncate">{name}</span>
                        </div>

                        {/* Logout */}
                        <button onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-300 hover:text-red-200 rounded-xl text-sm font-medium transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>

                        {/* Mobile hamburger */}
                        <button onClick={() => setMenuOpen(o => !o)}
                            className="md:hidden flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
                            {menuOpen
                                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-white/10 space-y-1">
                        {/* Mobile wallet + user */}
                        <div className="flex items-center justify-between px-2 py-3 mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                    {name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-white font-medium">{name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-xl px-3 py-1.5">
                                <span className="text-green-400 text-sm">₹</span>
                                <span className="text-green-300 font-bold text-sm">
                                    {typeof money === 'number' ? money.toFixed(2) : money || '0.00'}
                                </span>
                            </div>
                        </div>
                        {NAV_LINKS.map(link => (
                            <button key={link.to} onClick={() => { navigate(link.to); setMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                    ${isActive(link.to)
                                        ? 'bg-white/20 text-white'
                                        : link.highlight
                                            ? 'text-yellow-300 hover:bg-yellow-500/10'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}>
                                {link.icon}
                                {link.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
