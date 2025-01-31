import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MatchByDate.css';
import '../styles/loginPage.css';

function MatchesByDate({ token, userID }) {
    const [today, setToday] = useState('');
    const [matches, setMatches] = useState([]);
    const [serverResponse, setServerResponse] = useState('');

    useEffect(() => {
        // Fetch today's date
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
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
        // Fetch matches by date
        fetchMatchesByDate(formattedDate);
    }, [token]);

   

    const postVote = async (team, matchid) => {
        try {
            const jsonData = { 
                user_id: userID,
                match_id: matchid,
                voted_team_name: team
            };

           const response = await axios.post(`https://ipl-voting-management-prod.onrender.com/Insertvote`, jsonData, {
          //  const response = await axios.post(`http://localhost:8080/Insertvote`, jsonData, {
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
        <div className="login-container">
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
                width={300}
            />
            {serverResponse && (<label>Server Response: {serverResponse}</label>)}
        </div>
     );
}

export default MatchesByDate;
