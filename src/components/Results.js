import React, { useState } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

function Results() {
    const today = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
    const [selectedDate, setSelectedDate] = useState(today);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
            <div className="absolute inset-0 bg-black opacity-40"></div>

            <div className="relative z-10">
                {/* Nav */}
                <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">IPL Results</h1>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-300 hover:text-white text-sm underline transition-colors"
                    >
                        ← Back to Login
                    </button>
                </nav>

                <div className="container mx-auto px-4 py-10 max-w-3xl">
                    {/* Date Picker */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
                        <h2 className="text-white text-lg font-semibold mb-4">Select a Date to View Results</h2>
                        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="text-gray-300 text-sm block mb-1">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={today}
                                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:dark]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Loading...' : 'View Results'}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    {searched && !loading && (
                        results.length === 0 ? (
                            <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                                <svg className="w-14 h-14 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-white font-semibold text-lg">No matches found</p>
                                <p className="text-gray-400 text-sm mt-1">for {formatDate(selectedDate)}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <p className="text-gray-300 text-sm text-center">
                                    Showing results for <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                                </p>
                                {results.map((result) => (
                                    <div key={result.matchId} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl">
                                        {/* Match Header */}
                                        <div className="flex items-center justify-between mb-5">
                                            <span className="text-gray-400 text-xs">Match #{result.matchId}</span>
                                            {result.winnerTeam ? (
                                                <span className="bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                                                    ✅ Result Declared
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-500/30">
                                                    ⏳ Result Pending
                                                </span>
                                            )}
                                        </div>

                                        {/* Teams */}
                                        <div className="flex items-center justify-center gap-4 mb-5">
                                            <div className={`flex-1 text-center py-3 px-4 rounded-xl font-bold text-white text-lg ${result.winnerTeam === result.team1 ? 'bg-green-500/30 border-2 border-green-400' : 'bg-white/10'}`}>
                                                {result.team1}
                                                {result.winnerTeam === result.team1 && (
                                                    <div className="text-green-300 text-xs font-normal mt-1">🏆 Winner</div>
                                                )}
                                            </div>
                                            <div className="text-gray-400 font-bold text-sm">VS</div>
                                            <div className={`flex-1 text-center py-3 px-4 rounded-xl font-bold text-white text-lg ${result.winnerTeam === result.team2 ? 'bg-green-500/30 border-2 border-green-400' : 'bg-white/10'}`}>
                                                {result.team2}
                                                {result.winnerTeam === result.team2 && (
                                                    <div className="text-green-300 text-xs font-normal mt-1">🏆 Winner</div>
                                                )}
                                            </div>
                                        </div>

                                        {result.winnerTeam && (
                                            <>
                                                {/* Prize Info */}
                                                <div className="grid grid-cols-2 gap-3 mb-5">
                                                    <div className="bg-white/10 rounded-xl p-3 text-center">
                                                        <p className="text-gray-400 text-xs mb-1">Total Prize Pool</p>
                                                        <p className="text-white font-bold text-lg">₹{result.totalPool.toFixed(0)}</p>
                                                    </div>
                                                    <div className="bg-white/10 rounded-xl p-3 text-center">
                                                        <p className="text-gray-400 text-xs mb-1">Per Winner</p>
                                                        <p className="text-green-300 font-bold text-lg">₹{result.amountPerWinner.toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                {/* Winners List */}
                                                <div className="bg-white/5 rounded-xl p-4">
                                                    <p className="text-gray-300 text-sm font-semibold mb-3">
                                                        🎉 Winners ({result.winners.length})
                                                    </p>
                                                    {result.winners.length === 0 ? (
                                                        <p className="text-gray-500 text-sm">No one voted for the winning team.</p>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {result.winners.map((name, i) => (
                                                                <span key={i} className="bg-orange-500/20 border border-orange-500/30 text-orange-200 text-xs px-3 py-1 rounded-full">
                                                                    {name}
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
                </div>
            </div>
        </div>
    );
}

export default Results;
