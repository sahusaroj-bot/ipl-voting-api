import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function Countdown({ deadline, onExpire }) {
    const calc = useCallback(() => {
        const diff = new Date(deadline) - new Date();
        if (diff <= 0) return null;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return { h, m, s };
    }, [deadline]);

    const [time, setTime] = useState(calc());

    useEffect(() => {
        const timer = setInterval(() => {
            const t = calc();
            setTime(t);
            if (!t) { clearInterval(timer); onExpire(); }
        }, 1000);
        return () => clearInterval(timer);
    }, [calc, onExpire]);

    if (!time) return null;

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-yellow-300 text-xs font-medium">⏰ Voting closes in</span>
            <div className="flex gap-1">
                {[['h', time.h], ['m', time.m], ['s', time.s]].map(([label, val]) => (
                    <div key={label} className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg px-2 py-1 text-center min-w-[36px]">
                        <div className="text-yellow-300 font-bold text-sm leading-none">{pad(val)}</div>
                        <div className="text-yellow-500 text-[9px] uppercase">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VoterCard({ team, voters, isWinner, color }) {
    const gradients = {
        blue: 'from-blue-600/30 to-blue-900/30 border-blue-500/30',
        orange: 'from-orange-600/30 to-orange-900/30 border-orange-500/30',
    };
    const badges = {
        blue: 'bg-blue-500/20 border-blue-400/30 text-blue-200',
        orange: 'bg-orange-500/20 border-orange-400/30 text-orange-200',
    };
    const headers = {
        blue: 'text-blue-300',
        orange: 'text-orange-300',
    };

    return (
        <div className={`flex-1 bg-gradient-to-b ${gradients[color]} border rounded-2xl p-5 relative overflow-hidden`}>
            {/* subtle glow */}
            <div className={`absolute inset-0 opacity-10 ${color === 'blue' ? 'bg-blue-400' : 'bg-orange-400'} blur-2xl rounded-2xl`} />

            <div className="relative z-10">
                <div className="text-center mb-4">
                    <h3 className={`font-extrabold text-xl ${headers[color]} tracking-wide`}>{team}</h3>
                    <div className={`inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${badges[color]} border`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {voters.length} {voters.length === 1 ? 'vote' : 'votes'}
                    </div>
                </div>

                {voters.length === 0 ? (
                    <div className="text-center py-6">
                        <div className="text-3xl mb-2">🏏</div>
                        <p className="text-gray-500 text-sm">No votes yet</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {voters.map((name, i) => (
                            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${badges[color]}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${color === 'blue' ? 'bg-blue-500/40 text-blue-200' : 'bg-orange-500/40 text-orange-200'}`}>
                                    {name.charAt(0).toUpperCase()}
                                </div>
                                {name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function MatchCard({ match, onDeadlineExpire }) {
    const deadlineDate = match.votingDeadline ? new Date(match.votingDeadline) : null;
    const isPassed = match.deadlinePassed;
    const total = match.team1Voters.length + match.team2Voters.length;
    const t1Pct = total === 0 ? 50 : Math.round((match.team1Voters.length / total) * 100);
    const t2Pct = 100 - t1Pct;

    const formatDeadline = (d) => d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-4 flex items-center justify-between ${isPassed ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-b border-green-500/20' : 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-b border-white/10'}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPassed ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
                    <span className="text-gray-300 text-sm font-medium">Match #{match.matchId}</span>
                </div>
                {isPassed ? (
                    <span className="bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold px-3 py-1 rounded-full">
                        🔒 Voting Closed
                    </span>
                ) : (
                    <span className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full">
                        🟢 Voting Open
                    </span>
                )}
            </div>

            <div className="p-6">
                {/* Teams title row */}
                <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-blue-300 font-extrabold text-2xl flex-1 text-center">{match.team1}</span>
                    <div className="bg-white/10 rounded-full w-10 h-10 flex items-center justify-center border border-white/20 shrink-0">
                        <span className="text-white font-black text-xs">VS</span>
                    </div>
                    <span className="text-orange-300 font-extrabold text-2xl flex-1 text-center">{match.team2}</span>
                </div>

                {/* Deadline info */}
                {deadlineDate && (
                    <p className="text-center text-gray-500 text-xs mb-1">
                        Deadline: {formatDeadline(deadlineDate)}
                    </p>
                )}

                {/* Countdown */}
                {!isPassed && deadlineDate && (
                    <Countdown deadline={deadlineDate} onExpire={onDeadlineExpire} />
                )}

                {/* Vote bar */}
                {isPassed && total > 0 && (
                    <div className="mt-5 mb-1">
                        <div className="flex rounded-full overflow-hidden h-3 bg-white/10">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700" style={{ width: `${t1Pct}%` }} />
                            <div className="bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700" style={{ width: `${t2Pct}%` }} />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span className="text-blue-400 font-semibold">{t1Pct}%</span>
                            <span className="text-gray-500">{total} total votes</span>
                            <span className="text-orange-400 font-semibold">{t2Pct}%</span>
                        </div>
                    </div>
                )}

                {/* Voter reveal — only after deadline */}
                {isPassed ? (
                    <div className="flex gap-4 mt-5">
                        <VoterCard team={match.team1} voters={match.team1Voters} color="blue" />
                        <VoterCard team={match.team2} voters={match.team2Voters} color="orange" />
                    </div>
                ) : (
                    <div className="mt-6 text-center py-8 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-4xl mb-3">🔐</div>
                        <p className="text-white font-semibold">Votes are hidden</p>
                        <p className="text-gray-400 text-sm mt-1">Voter details will be revealed after the deadline</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TodayVotes() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchVotes = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/today-votes`);
            setMatches(res.data);
        } catch (err) {
            console.error('Error fetching today votes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVotes(); }, [fetchVotes]);

    // Re-fetch when a deadline expires so the card flips to revealed state
    const handleDeadlineExpire = useCallback(() => {
        setTimeout(fetchVotes, 2000); // small delay to let backend catch up
    }, [fetchVotes]);

    const today = new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 relative">
            {/* Background blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Nav */}
            <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-none">Today's Votes</h1>
                            <p className="text-gray-400 text-xs mt-0.5">{today}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </nav>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">Loading today's matches...</p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🏏</div>
                        <h2 className="text-white text-2xl font-bold mb-2">No Matches Today</h2>
                        <p className="text-gray-400">Check back when matches are scheduled.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {matches.map((match) => (
                            <MatchCard
                                key={match.matchId}
                                match={match}
                                onDeadlineExpire={handleDeadlineExpire}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
