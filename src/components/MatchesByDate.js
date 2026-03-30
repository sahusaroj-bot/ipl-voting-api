import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API = process.env.REACT_APP_API_URL;

// IPL team color map
const TEAM_COLORS = {
    'CSK':  { from: 'from-yellow-400',  to: 'to-yellow-600',  shadow: 'shadow-yellow-500/40',  text: 'text-yellow-900' },
    'MI':   { from: 'from-blue-500',    to: 'to-blue-700',    shadow: 'shadow-blue-500/40',    text: 'text-white' },
    'RCB':  { from: 'from-red-500',     to: 'to-red-700',     shadow: 'shadow-red-500/40',     text: 'text-white' },
    'KKR':  { from: 'from-purple-600',  to: 'to-purple-900',  shadow: 'shadow-purple-500/40',  text: 'text-white' },
    'DC':   { from: 'from-blue-400',    to: 'to-red-500',     shadow: 'shadow-blue-400/40',    text: 'text-white' },
    'PBKS': { from: 'from-red-400',     to: 'to-red-600',     shadow: 'shadow-red-400/40',     text: 'text-white' },
    'RR':   { from: 'from-pink-400',    to: 'to-pink-700',    shadow: 'shadow-pink-400/40',    text: 'text-white' },
    'SRH':  { from: 'from-orange-400',  to: 'to-orange-600',  shadow: 'shadow-orange-400/40',  text: 'text-white' },
    'GT':   { from: 'from-sky-400',     to: 'to-sky-700',     shadow: 'shadow-sky-400/40',     text: 'text-white' },
    'LSG':  { from: 'from-teal-400',    to: 'to-teal-700',    shadow: 'shadow-teal-400/40',    text: 'text-white' },
};

function getTeamStyle(name = '') {
    const key = Object.keys(TEAM_COLORS).find(k =>
        name.toUpperCase().includes(k)
    );
    return TEAM_COLORS[key] || { from: 'from-slate-500', to: 'to-slate-700', shadow: 'shadow-slate-500/40', text: 'text-white' };
}

function TeamInitials(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
}

function Toast({ message, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-green-500/40 animate-bounce-once">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{message}</span>
        </div>
    );
}

// Live countdown shown on match card
function MatchCountdown({ deadline }) {
    const calc = useCallback(() => {
        const diff = new Date(deadline) - new Date();
        if (diff <= 0) return null;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return { h, m, s };
    }, [deadline]);

    const [time, setTime] = useState(calc);
    useEffect(() => {
        const t = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(t);
    }, [calc]);

    if (!time) return (
        <span className="text-xs text-red-400 font-semibold">🔒 Voting closed</span>
    );
    const pad = n => String(n).padStart(2, '0');
    return (
        <span className="text-xs text-yellow-300 font-semibold">
            ⏰ {pad(time.h)}:{pad(time.m)}:{pad(time.s)} left
        </span>
    );
}

function MatchCard({ match, voteData, onVote }) {
    const [voting, setVoting] = useState(null);
    const t1 = getTeamStyle(match.team1);
    const t2 = getTeamStyle(match.team2);

    const deadline = match.votingDeadline ? new Date(match.votingDeadline) : null;
    const isClosed = deadline && new Date() > deadline;

    // vote counts from today-votes data (only shown after deadline)
    const t1Count = voteData?.team1Voters?.length ?? 0;
    const t2Count = voteData?.team2Voters?.length ?? 0;
    const totalVotes = t1Count + t2Count;
    const t1Pct = totalVotes === 0 ? 50 : Math.round((t1Count / totalVotes) * 100);
    const t2Pct = 100 - t1Pct;

    const handleVote = async (team, side) => {
        if (isClosed) return;
        setVoting(side);
        await onVote(team, match.id);
        setVoting(null);
    };

    const formatDeadline = d => d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    return (
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300">
            {/* Top accent line */}
            <div className={`h-1 w-full ${isClosed ? 'bg-red-500/60' : 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500'}`} />

            <div className="p-4 sm:p-6">
                {/* Match meta row */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                        Match #{match.id}
                    </span>
                    {isClosed
                        ? <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">🔒 Voting Closed</span>
                        : <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">🟢 Open</span>
                    }
                </div>

                {/* Deadline + countdown */}
                {deadline && (
                    <div className="flex items-center justify-between mb-4 bg-white/4 rounded-xl px-3 py-2 border border-white/8">
                        <span className="text-xs text-gray-500">📅 {formatDeadline(deadline)}</span>
                        <MatchCountdown deadline={deadline} />
                    </div>
                )}

                {/* Teams row */}
                <div className="flex items-center gap-3">
                    {/* Team 1 */}
                    <button
                        onClick={() => handleVote(match.team1, 'team1')}
                        disabled={voting !== null || isClosed}
                        className={`flex-1 relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-gradient-to-br ${t1.from} ${t1.to} shadow-lg ${t1.shadow}
                            ${!isClosed ? 'hover:scale-105 hover:shadow-xl active:scale-95' : 'opacity-60 cursor-not-allowed'}
                            transition-all duration-200 disabled:scale-100`}
                    >
                        {voting === 'team1' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                            <span className="text-white font-black text-xs tracking-tight">{TeamInitials(match.team1)}</span>
                        </div>
                        <span className={`font-bold text-xs text-center leading-tight ${t1.text} drop-shadow`}>{match.team1}</span>
                        {!isClosed && <span className="text-[10px] text-white/60">Tap to vote</span>}
                        {isClosed && totalVotes > 0 && (
                            <span className="text-[11px] font-bold text-white/90">{t1Count} votes ({t1Pct}%)</span>
                        )}
                    </button>

                    {/* VS */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-white font-black text-xs">VS</span>
                        </div>
                        {isClosed && totalVotes > 0 && (
                            <span className="text-[10px] text-gray-500">{totalVotes} total</span>
                        )}
                    </div>

                    {/* Team 2 */}
                    <button
                        onClick={() => handleVote(match.team2, 'team2')}
                        disabled={voting !== null || isClosed}
                        className={`flex-1 relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl bg-gradient-to-br ${t2.from} ${t2.to} shadow-lg ${t2.shadow}
                            ${!isClosed ? 'hover:scale-105 hover:shadow-xl active:scale-95' : 'opacity-60 cursor-not-allowed'}
                            transition-all duration-200 disabled:scale-100`}
                    >
                        {voting === 'team2' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                            <span className="text-white font-black text-xs tracking-tight">{TeamInitials(match.team2)}</span>
                        </div>
                        <span className={`font-bold text-xs text-center leading-tight ${t2.text} drop-shadow`}>{match.team2}</span>
                        {!isClosed && <span className="text-[10px] text-white/60">Tap to vote</span>}
                        {isClosed && totalVotes > 0 && (
                            <span className="text-[11px] font-bold text-white/90">{t2Count} votes ({t2Pct}%)</span>
                        )}
                    </button>
                </div>

                {/* Vote bar — shown after deadline */}
                {isClosed && totalVotes > 0 && (
                    <div className="mt-4">
                        <div className="flex rounded-full overflow-hidden h-2 bg-white/10">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700" style={{ width: `${t1Pct}%` }} />
                            <div className="bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700" style={{ width: `${t2Pct}%` }} />
                        </div>
                    </div>
                )}

                {/* Link to full vote details */}
                {isClosed && (
                    <a href="/today-votes"
                        className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        See who voted →
                    </a>
                )}
            </div>
        </div>
    );
}

export default function MatchesByDate() {
    const [today, setToday] = useState('');
    const [matches, setMatches] = useState([]);
    const [voteMap, setVoteMap] = useState({});
    const [money, setMoney] = useState(0);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    const name = localStorage.getItem('name');

    const fetchData = useCallback(async (date) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [matchRes, moneyRes, voteRes] = await Promise.all([
                axios.get(`${API}/by-date`, { params: { date }, headers }),
                axios.get(`${API}/getMoney`, { params: { id: userID }, headers }),
                axios.get(`${API}/today-votes`, { headers }),
            ]);
            setMatches(matchRes.data || []);
            setMoney(moneyRes.data || 0);
            // build a map: matchId -> voteData
            const map = {};
            (voteRes.data || []).forEach(v => { map[v.matchId] = v; });
            setVoteMap(map);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, userID]);

    useEffect(() => {
        if (!token || !userID) { navigate('/login'); return; }
        const date = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
        setToday(date);
        fetchData(date);
    }, [token, userID, navigate, fetchData]);

    const handleVote = async (team, matchId) => {
        try {
            await axios.post(`${API}/Insertvote`,
                { user_id: parseInt(userID), match_id: matchId, voted_team_name: team },
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            setToast(`✅ Voted for ${team}!`);
            // Refresh money
            const res = await axios.get(`${API}/getMoney`, {
                params: { id: userID },
                headers: { Authorization: `Bearer ${token}` }
            });
            setMoney(res.data || 0);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to submit vote.';
            setToast(`❌ ${msg}`);
        }
    };

    // Format today nicely
    const formattedDate = today
        ? new Date(today).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : '';

    return (
        <div className="min-h-screen bg-[#0d0d1a] relative overflow-x-hidden">
            {/* Ambient background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
            </div>

            <Navbar money={money} />

            <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">

                {/* Hero header */}
                <div className="mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Welcome back,</p>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                                {name} 👋
                            </h1>
                            <p className="text-gray-400 mt-1 text-sm">{formattedDate}</p>
                        </div>
                        {/* Quick stats */}
                        <div className="flex gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center">
                                <p className="text-gray-500 text-xs mb-1">Matches Today</p>
                                <p className="text-white font-extrabold text-2xl">{matches.length}</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-3 text-center">
                                <p className="text-gray-400 text-xs mb-1">Your Wallet</p>
                                <p className="text-green-400 font-extrabold text-2xl">
                                    ₹{typeof money === 'number' ? money.toFixed(2) : money}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest px-3">
                        Today's Matches
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500">Loading matches...</p>
                    </div>
                )}

                {/* No matches */}
                {!loading && matches.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                            <span className="text-5xl">🏏</span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">No Matches Today</h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            There are no IPL matches scheduled for today. Check back tomorrow!
                        </p>
                        <button onClick={() => navigate('/previous-results')}
                            className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-sm font-medium transition-all">
                            View Past Results →
                        </button>
                    </div>
                )}

                {/* Match cards */}
                {!loading && matches.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                        {matches.map(match => (
                            <MatchCard key={match.id} match={match} voteData={voteMap[match.id]} onVote={handleVote} />
                        ))}
                    </div>
                )}

                {/* Bottom CTA strip */}
                {!loading && (
                    <div className="mt-12 grid sm:grid-cols-2 gap-4">
                        <button onClick={() => navigate('/leaderboard')}
                            className="flex items-center justify-between bg-gradient-to-r from-yellow-500/15 to-amber-500/10 hover:from-yellow-500/25 hover:to-amber-500/20 border border-yellow-500/20 rounded-2xl px-6 py-5 transition-all group">
                            <div className="text-left">
                                <p className="text-yellow-300 font-bold text-base">Leaderboard</p>
                                <p className="text-gray-500 text-xs mt-0.5">See who's winning the most</p>
                            </div>
                            <span className="text-3xl group-hover:scale-110 transition-transform">🏆</span>
                        </button>
                        <button onClick={() => navigate('/previous-results')}
                            className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-5 transition-all group">
                            <div className="text-left">
                                <p className="text-white font-bold text-base">Past Results</p>
                                <p className="text-gray-500 text-xs mt-0.5">Check previous match winners</p>
                            </div>
                            <span className="text-3xl group-hover:scale-110 transition-transform">📊</span>
                        </button>
                    </div>
                )}
            </main>

            {/* Toast */}
            {toast && <Toast message={toast} onDone={() => setToast('')} />}
        </div>
    );
}
