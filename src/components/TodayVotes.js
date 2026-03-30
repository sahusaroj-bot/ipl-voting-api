import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

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

function VoterCard({ team, voters, color }) {
    const styles = {
        blue:   { wrap: 'from-blue-600/20 to-blue-900/20 border-blue-500/25',   badge: 'bg-blue-500/20 border-blue-400/30 text-blue-200',   head: 'text-blue-300',   avatar: 'bg-blue-500/40 text-blue-200' },
        orange: { wrap: 'from-orange-600/20 to-orange-900/20 border-orange-500/25', badge: 'bg-orange-500/20 border-orange-400/30 text-orange-200', head: 'text-orange-300', avatar: 'bg-orange-500/40 text-orange-200' },
    };
    const s = styles[color];
    return (
        <div className={`flex-1 min-w-0 bg-gradient-to-b ${s.wrap} border rounded-2xl p-4`}>
            <div className="text-center mb-3">
                <h3 className={`font-extrabold text-base sm:text-lg ${s.head} truncate`}>{team}</h3>
                <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.badge} border`}>
                    {voters.length} {voters.length === 1 ? 'vote' : 'votes'}
                </span>
            </div>
            {voters.length === 0
                ? <div className="text-center py-4"><p className="text-gray-500 text-sm">No votes yet</p></div>
                : <div className="flex flex-wrap gap-1.5 justify-center">
                    {voters.map((name, i) => (
                        <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${s.badge}`}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${s.avatar}`}>
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="max-w-[80px] truncate">{name}</span>
                        </div>
                    ))}
                </div>
            }
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
                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
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

    return (
        <div className="min-h-screen bg-[#0d0d1a] relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
            </div>

            <Navbar />

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
