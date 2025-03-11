import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import '../styles/MatchByDate.css';
import '../styles/loginPage.css';

function MatchesByDate({ token, userID,name }) {
    const [today, setToday] = useState('');
    const [matches, setMatches] = useState([]);
    const [Money, setMoney] = useState([]);

    const [serverResponse, setServerResponse] = useState('');

    useEffect(() => {
        const id=userID;
        // Fetch today's date
        const currentDate = new Date();
        const timeZone = 'Asia/Kolkata';
        const formattedDate = formatInTimeZone(currentDate, timeZone, 'yyyy-MM-dd');
        setToday(formattedDate);

        const fetchMatchesByDate = async (date) => { 
            try {
                const response = await axios.get(`https://ipl-voting-management-prod.onrender.com/by-date`, {
                //const response = await axios.get(`http://localhost:8080/by-date`, {
                    params: { date },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMatches(response.data);
                console.log(response);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };
        const FetchMoney = async () => { 
            try {
                const response = await axios.get(`https://ipl-voting-management-prod.onrender.com/getMoney`, {
                //const response = await axios.get(`http://localhost:8080/getMoney`, {
                    params: {id},
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                });
                setMoney(response.data);
                console.log(response);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };
        // Fetch matches by date
        fetchMatchesByDate(formattedDate);
        FetchMoney();
    }, [token, userID]);

   

    const postVote = async (team, matchid) => {
        try {
            const jsonData = { 
                user_id: userID,
                match_id: matchid,
                voted_team_name: team
            };

          const response = await axios.post(`https://ipl-voting-management-prod.onrender.com/Insertvote`, jsonData, {
           //const response = await axios.post(`http://localhost:8080/Insertvote`, jsonData, {
                 headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            
        );
           
            if (response.status === 200) {
                setServerResponse('Success: Vote saved successfully');
                alert("Vote saved successfully");
            } 
            else{
                setServerResponse(response.data.message);
                alert("duplicate voting is not allowed ");
            } 
          
        } catch (error) {
            console.error('Error posting vote:', error);
        }
    };

    const handleTeamClick = async (teamName, matchid) => {
        console.log('Team clicked:', teamName); 
        await postVote(teamName, matchid);
        console.log('postVote method called inside handleTeamClick');
    };

    return (
        <div className="min-h-screen bg-gray-100">
                        <nav className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-1xl font-bold">{name}</div>
                    <div>
                        <h2 className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">Money: {Money}</h2>
                        <a href="/previous-results" className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">Previous Results</a>
                        <a href="#information" className="text-white px-4 py-2 hover:bg-purple-700 rounded transition duration-300">Information</a>
                    </div>
                </div>
            </nav>
            <h1 className='label'>Today's Date</h1>
            <br />{today}
            <br />
            <h1 className='label'>Today's Matches</h1>
            {matches.length === 0 ? ( <p>No Match Scheduled for Today</p> ) : (
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
        <br></br>
            <h1>Vote for your Favorite Team</h1>
            <span><h1 className='label'>E sala cup namde</h1></span>
            <img src='https://media.giphy.com/media/SvohqSY2NlobP1vYEh/giphy.gif?cid=790b7611j3bqm3tli1wmn87vdzdbo0g9sudez57sezh1jnud&ep=v1_gifs_search&rid=giphy.gif&ct=g' 
     alt='RCB' 
     className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto" />

            {serverResponse && (<label>Server Response: {serverResponse}</label>)}
        </div>
     );
}

export default MatchesByDate;
