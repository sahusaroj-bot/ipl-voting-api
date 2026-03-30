import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const MEDALS = ['🥇', '🥈', '🥉'];

const PODIUM = [
    { ring: 'ring-yellow-400',  border: 'border-yellow-400/50',  glow: 'shadow-yellow-400/30',  badge: 'from-yellow-400 to-amber-400',   text: 'text-gray-900' },
    { ring: 'ring-slate-300',   border: 'border-slate-300/50',   glow: 'shadow-slate-300/20',   badge: 'from-slate-300 to-slate-400',    text: 'text-gray-900' },
    { ring: 'ring-amber-500',   border: 'border-amber-500/50',   glow: 'shadow-amber-500/30',   badge: 'from-amber-500 to-orange-500',   text: 'text-white'    },
];

const AVATAR_COLORS = [
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
];

function avatarColor(name) {
    return AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

function Avatar({ name, size = 44 }) {
    return (
        <div
            className={`flex items-center justify-center rounded-full bg-gradient-to-br ${avatarColor(name)} text-white font-bold select-none shrink-0`}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}

/* ── Podium card — fully fluid width ── */
function PodiumCard({ user, rank }) {
    const p = PODIUM[rank];
    const isFirst = rank === 0;
    return (
        <div className={`flex flex-col items-center ${isFirst ? '-mt-4 sm:-mt-8' : 'mt-2'}`}>
            {isFirst && <div className="text-2xl sm:text-4xl mb-1 animate-bounce">👑</div>}

            <div className={`relative flex flex-col items-center bg-white/8 backdrop-blur-lg
                             border ${p.border} rounded-2xl shadow-xl ${p.glow}
                             px-3 py-4 sm:px-5 sm:py-6 w-full
                             transition-transform hover:scale-105`}>

                <span className="text-xl sm:text-3xl mb-1 sm:mb-2">{MEDALS[rank]}</span>

                <div className={`ring-2 sm:ring-4 ring-offset-1 ring-offset-transparent ${p.ring} rounded-full mb-2`}>
                    <Avatar name={user.username} size={isFirst ? 52 : 44} />
                </div>

                <p className="text-white font-bold text-xs sm:text-sm text-center w-full truncate px-1">
                    {user.username}
                </p>

                <div className={`mt-1.5 px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r ${p.badge} ${p.text} font-extrabold text-xs shadow`}>
                    ₹{user.totalAmount?.toFixed(2)}
                </div>

                <div className="absolute -top-2.5 -right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1a1a2e] border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                    {rank + 1}
                </div>
            </div>
        </div>
    );
}

/* ── List row ── */
function LeaderboardRow({ user, rank, currentUserID }) {
    const isMe = String(user.id) === String(currentUserID);
    return (
        <div className={`flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl border transition-all
            ${isMe
                ? 'bg-orange-500/15 border-orange-400/40 shadow-md shadow-orange-500/10'
                : 'bg-white/4 border-white/8 hover:bg-white/8'}`}>

            {/* rank */}
            <div className="w-6 sm:w-8 text-center font-bold text-gray-500 text-xs sm:text-sm shrink-0">
                {rank <= 2 ? MEDALS[rank] : `#${rank + 1}`}
            </div>

            {/* avatar */}
            <Avatar name={user.username} size={36} />

            {/* name + date */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-semibold text-sm truncate ${isMe ? 'text-orange-300' : 'text-white'}`}>
                        {user.username}
                    </span>
                    {isMe && (
                        <span className="text-[10px] bg-orange-500/25 text-orange-300 border border-orange-400/30 px-1.5 py-0.5 rounded-full shrink-0">
                            You
                        </span>
                    )}
                </div>
                {user.lastUpdatedDate && (
                    <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">
                        Last win: {new Date(user.lastUpdatedDate).toLocaleDateString('en-IN')}
                    </p>
                )}
            </div>

            {/* last win amount — hide on very small */}
            {user.lastSavedAmount > 0 && (
                <span className="hidden sm:block text-xs text-green-400 font-medium shrink-0">
                    +₹{user.lastSavedAmount?.toFixed(2)}
                </span>
            )}

            {/* total */}
            <div className={`font-bold text-sm sm:text-base shrink-0 ${isMe ? 'text-orange-300' : 'text-white'}`}>
                ₹{user.totalAmount?.toFixed(2)}
            </div>
        </div>
    );
}

export default function LeaderboardView() {
    const [leaders, setLeaders]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [search, setSearch]     = useState('');
    const navigate                = useNavigate();

    const token         = localStorage.getItem('token');
    const currentUserID = localStorage.getItem('userID');
    const name          = localStorage.getItem('name');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        api.get('/leaderboard')
            .then(res => setLeaders(res.data))
            .catch(() => setError('Failed to load leaderboard.'))
            .finally(() => setLoading(false));
    }, [token, navigate]);

    const filtered       = leaders.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));
    const top3           = filtered.slice(0, 3);
    const rest           = filtered.slice(3);
    const currentRank    = leaders.findIndex(u => String(u.id) === String(currentUserID));
    const currentUser    = leaders[currentRank];

    return (
        <div className="min-h-screen bg-[#0d0d1a] relative">
            {/* blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-600/8 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-40 w-80 h-80 bg-orange-600/8 rounded-full blur-3xl" />
            </div>

            <Navbar money={currentUser?.totalAmount} />

            <div className="relative z-10 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

                {/* ── Page title ── */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">
                        🏆 Hall of Fame
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Rankings based on total winnings</p>
                </div>

                {/* ── Your rank banner ── */}
                {!loading && currentRank >= 0 && (
                    <div className="mb-6 bg-gradient-to-r from-orange-500/15 to-pink-500/15 border border-orange-400/25 rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <span className="text-xl sm:text-2xl shrink-0">🎯</span>
                                <div className="min-w-0">
                                    <p className="text-orange-300 font-semibold text-xs sm:text-sm">Your Ranking</p>
                                    <p className="text-white font-bold text-sm sm:text-base truncate">
                                        {name} — #{currentRank + 1} <span className="text-gray-500 font-normal">of {leaders.length}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-gray-500 text-xs">Winnings</p>
                                <p className="text-orange-300 font-extrabold text-lg sm:text-xl">
                                    ₹{currentUser?.totalAmount?.toFixed(2) ?? '0.00'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Loading leaderboard…</p>
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="text-center py-12 text-red-400 bg-red-500/8 rounded-2xl border border-red-500/20">
                        <span className="text-4xl block mb-3">⚠️</span>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* ── Podium ── */}
                        {top3.length > 0 && (
                            <div className="mb-8">
                                {/* podium: 3 equal columns, items align to bottom */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
                                    {top3.length > 1
                                        ? <PodiumCard user={top3[1]} rank={1} />
                                        : <div />}
                                    <PodiumCard user={top3[0]} rank={0} />
                                    {top3.length > 2
                                        ? <PodiumCard user={top3[2]} rank={2} />
                                        : <div />}
                                </div>
                            </div>
                        )}

                        {/* ── Search ── */}
                        {leaders.length > 5 && (
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search player…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#1e1e2e] border border-white/10 rounded-xl text-gray-100 text-sm placeholder-gray-600
                                               focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/40 transition-all"
                                />
                            </div>
                        )}

                        {/* ── List ── */}
                        {filtered.length === 0
                            ? <p className="text-center text-gray-500 py-10">No players found.</p>
                            : (
                                <div className="space-y-2">
                                    {search
                                        ? filtered.map(user => {
                                            const r = leaders.findIndex(u => u.id === user.id);
                                            return <LeaderboardRow key={user.id} user={user} rank={r} currentUserID={currentUserID} />;
                                        })
                                        : rest.map((user, i) => (
                                            <LeaderboardRow key={user.id} user={user} rank={i + 3} currentUserID={currentUserID} />
                                        ))
                                    }
                                </div>
                            )
                        }

                        {/* ── Empty state ── */}
                        {leaders.length === 0 && (
                            <div className="text-center py-16 bg-white/4 rounded-2xl border border-white/8">
                                <span className="text-5xl block mb-4">🏏</span>
                                <p className="text-white font-semibold">No rankings yet</p>
                                <p className="text-gray-500 text-sm mt-1">Start voting to appear on the leaderboard!</p>
                            </div>
                        )}

                        {leaders.length > 0 && (
                            <p className="text-center text-gray-600 text-xs mt-6">
                                {leaders.length} players ranked · updates after each result
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
