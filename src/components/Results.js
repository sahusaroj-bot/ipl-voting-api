import React, { useState } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API = process.env.REACT_APP_API_URL;

function Results() {
    const today = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
    const [selectedDate, setSelectedDate] = useState(today);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    const fetchResults = async (date) => {
        setLoading(true);
        setSearched(true);
        try {
            const response = await axios.get(`${API}/results`, { params: { date } });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchResults(selectedDate);
    };

    const formatDate = (dateStr) =>
        new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

    return (
        <div className="min-h-screen bg-[#0d0d1a] relative">
            {/* ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
            </div>

            {/* ── Navbar: full nav if logged in, minimal guest bar if not ── */}
            {isLoggedIn
                ? <Navbar />
                : (
                    <nav className="relative z-20 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-xl">
                        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <span className="text-lg">🏏</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm leading-none">IPL Voting</p>
                                    <p className="text-gray-500 text-xs">2025 Season</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/25">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Sign In to Vote
                            </button>
                        </div>
                    </nav>
                )
            }

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">

                {/* page title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400">
                        📊 Match Results
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Select a date to view match outcomes and winners</p>
                </div>

                {/* Date picker card */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 sm:p-6 mb-8">
                    <h2 className="text-white text-base font-semibold mb-4">Select Date</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs block mb-1.5">Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                max={today}
                                className="w-full px-4 py-3 rounded-xl bg-[#1e1e2e] text-gray-100 border border-white/10
                                           focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/40
                                           [color-scheme:dark] transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400
                                       text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25
                                       disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]">
                            {loading ? 'Loading…' : 'View Results'}
                        </button>
                    </form>
                </div>

                {/* loading spinner */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Fetching results…</p>
                    </div>
                )}

                {/* Results */}
                {searched && !loading && (
                    results.length === 0 ? (
                        <div className="text-center py-14 bg-white/4 rounded-2xl border border-white/8">
                            <svg className="w-14 h-14 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-white font-semibold text-lg">No matches found</p>
                            <p className="text-gray-500 text-sm mt-1">for {formatDate(selectedDate)}</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <p className="text-gray-500 text-sm text-center">
                                Results for <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                            </p>

                            {results.map((result) => (
                                <div key={result.matchId} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl">

                                    {/* match header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <span className="text-gray-500 text-xs">Match #{result.matchId}</span>
                                        {result.winnerTeam ? (
                                            <span className="bg-green-500/15 text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/25">
                                                ✅ Result Declared
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-500/15 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-500/25">
                                                ⏳ Pending
                                            </span>
                                        )}
                                    </div>

                                    {/* teams */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className={`flex-1 text-center py-3 px-2 rounded-xl font-bold text-white text-sm sm:text-base
                                            ${result.winnerTeam === result.team1
                                                ? 'bg-green-500/20 border-2 border-green-400/60'
                                                : 'bg-white/8 border border-white/10'}`}>
                                            {result.team1}
                                            {result.winnerTeam === result.team1 && (
                                                <div className="text-green-300 text-xs font-normal mt-1">🏆 Winner</div>
                                            )}
                                        </div>
                                        <div className="text-gray-500 font-bold text-xs shrink-0">VS</div>
                                        <div className={`flex-1 text-center py-3 px-2 rounded-xl font-bold text-white text-sm sm:text-base
                                            ${result.winnerTeam === result.team2
                                                ? 'bg-green-500/20 border-2 border-green-400/60'
                                                : 'bg-white/8 border border-white/10'}`}>
                                            {result.team2}
                                            {result.winnerTeam === result.team2 && (
                                                <div className="text-green-300 text-xs font-normal mt-1">🏆 Winner</div>
                                            )}
                                        </div>
                                    </div>

                                    {result.winnerTeam && (
                                        <>
                                            {/* prize pool */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                                    <p className="text-gray-500 text-xs mb-1">Prize Pool</p>
                                                    <p className="text-white font-bold text-lg">₹{result.totalPool?.toFixed(0)}</p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                                    <p className="text-gray-500 text-xs mb-1">Per Winner</p>
                                                    <p className="text-green-300 font-bold text-lg">₹{result.amountPerWinner?.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* winners list */}
                                            <div className="bg-white/4 rounded-xl p-4">
                                                <p className="text-gray-300 text-sm font-semibold mb-3">
                                                    🎉 Winners ({result.winners?.length ?? 0})
                                                </p>
                                                {!result.winners?.length ? (
                                                    <p className="text-gray-600 text-sm">No one voted for the winning team.</p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.winners.map((w, i) => (
                                                            <span key={i} className="bg-orange-500/15 border border-orange-500/25 text-orange-200 text-xs px-3 py-1 rounded-full">
                                                                {w}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* CTA for guests */}
                {!isLoggedIn && (
                    <div className="mt-10 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
                        <p className="text-white font-semibold mb-1">Want to vote and win?</p>
                        <p className="text-gray-400 text-sm mb-4">Create an account and start voting on today's matches.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all">
                            Sign In / Register →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Results;
