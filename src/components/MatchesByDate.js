import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import '../styles/MatchByDate.css';
import '../styles/loginPage.css';

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
                const response = await axios.get(`https://ipl-voting-management-prod.onrender.com/by-date`, {
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
                const response = await axios.get(`https://ipl-voting-management-prod.onrender.com/getMoney`, {
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
            const response = await axios.post(`https://ipl-voting-management-prod.onrender.com/Insertvote`, jsonData, {
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
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-1xl font-bold">{name}</div>
                    <div>
                        <h2 className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">
                            Money: {Money}
                        </h2>
                        <a href="/previous-results" className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">
                            Previous Results
                        </a>
                        <button
                            onClick={() => alert('This will show information about the app!')}
                            className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300"
                        >
                            Information
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-white px-4 py-2 hover:bg-red-600 rounded transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <h1 className="label">Today's Date</h1>
            <br />{today}
            <br />
            <h1 className="label">Today's Matches</h1>
            {matches.length === 0 ? (
                <p>No Match Scheduled for Today</p> // Displayed when no matches are available
            ) : (
                <ul>
                    {matches.map(match => (
                        <li key={match.id}>
                            <button
                                onClick={() => handleTeamClick(match.team1, match.id)}
                                className="button"
                            >
                                {match.team1}
                            </button>
                            vs
                            <button
                                onClick={() => handleTeamClick(match.team2, match.id)}
                                className="button"
                            >
                                {match.team2}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <br />
            <h1>Vote for your Favorite Team</h1>
            <span><h1 className="label">E sala cup namde</h1></span>
            <img
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTU0cDZuMDN5eXZnbGdjdjhtZDYya296M3IxMm1zaGFybjc1c2gyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O5tE2s5LLnDyPOFHIX/giphy.gif"
                alt="RCB"
                className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto"
            />
            {serverResponse && <label>Server Response: {serverResponse}</label>}
        </div>
    );
}

export default MatchesByDate;
