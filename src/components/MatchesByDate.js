import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';

function MatchesByDate() {
    const [today, setToday] = useState('');
    const [matches, setMatches] = useState([]);
    const [Money, setMoney] = useState([]);
    const [serverResponse, setServerResponse] = useState('');

    // Retrieve token, userID, and name from localStorage
    const token = localStorage.getItem('token'); // Token persisted in localStorage
    const userID = localStorage.getItem('userID'); // User ID persisted in localStorage
    const name = localStorage.getItem('name'); // Name persisted in localStorage

    // useEffect hook for fetching data and initializing state
    useEffect(() => {
        // Redirect to login page if token or userID is missing
        if (!token || !userID) {
            window.location.href = '/login'; // Redirects user to the login page
            return;
        }

        // Fetch today's date using the Asia/Kolkata time zone
        const currentDate = new Date();
        const timeZone = 'Asia/Kolkata';
        const formattedDate = formatInTimeZone(currentDate, timeZone, 'yyyy-MM-dd');
        setToday(formattedDate);

        // Function to fetch matches by date
        const fetchMatchesByDate = async (date) => {
            try {
                // Axios GET request for fetching matches
                //const response = await axios.get(`http://localhost:8080/by-date`, {
                const response = await axios.get(`https://api.iplvote.co.in/by-date`, {
                    params: { date }, // Sending date as a query parameter
                    headers: {
                        Authorization: `Bearer ${token}` // Setting Authorization header
                    }
                });
                setMatches(response.data); // Updating state with matches data
                console.log(response); // Logging response for debugging
            } catch (error) {
                console.error('Error fetching matches:', error); // Logging error if request fails
            }
        };

        // Function to fetch user's money details
        const fetchMoney = async () => {
            try {
                // Axios GET request for fetching money
                const response = await axios.get(`https://api.iplvote.co.in/getMoney`, {
                //const response = await axios.get(`http://localhost:8080/getMoney`, {
                    params: { id: userID }, // Sending user ID as a query parameter
                    headers: {
                        Authorization: `Bearer ${token}` // Setting Authorization header
                    }
                });
                setMoney(response.data); // Updating state with money data
                console.log(response); // Logging response for debugging
            } catch (error) {
                console.error('Error fetching money:', error); // Logging error if request fails
            }
        };

        // Fetching matches and money after today's date is determined
        fetchMatchesByDate(formattedDate);
        fetchMoney();
    }, [token, userID]); // Dependencies ensure this runs when token or userID changes

    // Function to post a vote
    const postVote = async (team, matchid) => {
        try {
            // JSON data for POST request
            const jsonData = {
                user_id: userID, // User ID
                match_id: matchid, // Match ID
                voted_team_name: team // Team name voted for
            };

            // Axios POST request for submitting a vote
            const response = await axios.post(`https://api.iplvote.co.in/Insertvote`, jsonData, {
            //const response = await axios.post(`http://localhost:8080/Insertvote`, jsonData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Setting Authorization header
                    'Content-Type': 'application/json' // Setting content type
                }
            });

            if (response.status === 200) {
                // Handling successful response
                setServerResponse('Success: Vote saved successfully');
                alert("Vote saved successfully");
            } else {
                // Handling duplicate voting scenario
                setServerResponse(response.data.message);
                alert("Duplicate voting is not allowed.");
            }
        } catch (error) {
            console.error('Error posting vote:', error); // Logging error if POST request fails
        }
    };

    // Handler function for when a team button is clicked
    const handleTeamClick = async (teamName, matchid) => {
        console.log('Team clicked:', teamName); // Logging which team was clicked
        await postVote(teamName, matchid); // Submitting the vote
        console.log('postVote method called inside handleTeamClick'); // Debugging log
    };

    // Logout function to clear session and redirect to login page
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        localStorage.removeItem('userID'); // Clear userID from localStorage
        localStorage.removeItem('name'); // Clear name from localStorage
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Navigation */}
            <nav className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* User Info */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-white font-semibold text-lg">Welcome, {name}</h2>
                                <div className="flex items-center space-x-2 text-green-300">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">₹{Money}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-wrap items-center gap-2">
                            <a href="/previous-results" className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="hidden sm:inline">Results</span>
                            </a>
                            <button
                                onClick={() => alert('This will show information about the app!')}
                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="hidden sm:inline">Info</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Date Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
                        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="text-gray-300 text-sm">Today's Date</p>
                            <p className="text-white text-xl font-semibold">{today}</p>
                        </div>
                    </div>
                </div>

                {/* Matches Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Today's Matches</h1>
                        <p className="text-gray-300">Vote for your favorite team and win exciting prizes!</p>
                    </div>

                    {matches.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-white mb-2">No Matches Today</h3>
                                <p className="text-gray-300">Check back tomorrow for exciting IPL matches!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:gap-8">
                            {matches.map(match => (
                                <div key={match.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl">
                                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                                        {/* Team 1 */}
                                        <button
                                            onClick={() => handleTeamClick(match.team1, match.id)}
                                            className="group flex-1 max-w-xs bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
                                        >
                                            <svg className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-lg">{match.team1}</span>
                                        </button>

                                        {/* VS Divider */}
                                        <div className="flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                                                <span className="text-white font-bold text-xl">VS</span>
                                            </div>
                                        </div>

                                        {/* Team 2 */}
                                        <button
                                            onClick={() => handleTeamClick(match.team2, match.id)}
                                            className="group flex-1 max-w-xs bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
                                        >
                                            <svg className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-lg">{match.team2}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Motivational Section */}
                <div className="text-center mt-12">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4">
                            E sala cup namde! 🏆
                        </h2>
                        <p className="text-gray-300 mb-6">Vote for your favorite team and be part of the IPL excitement!</p>
                        <div className="rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTU0cDZuMDN5eXZnbGdjdjhtZDYya296M3IxMm1zaGFybjc1c2gyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O5tE2s5LLnDyPOFHIX/giphy.gif"
                                alt="IPL Celebration"
                                className="w-full max-w-md mx-auto rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Server Response */}
                {serverResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg border border-green-400/50">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{serverResponse}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MatchesByDate;
