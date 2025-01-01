import React, { useState,useEffect } from 'react';
import axios from 'axios';
 import '../styles/MatchByDate.css';

function MatchesByDate({ token }) {
    const [today, setToday] = useState('');
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        // Fetch today's date
        const currentDate = new Date();
        // Format the date as yyyy-mm-dd
        const formattedDate = currentDate.toISOString().split('T')[0];
        // Update the state with today's date
        setToday(formattedDate);
    }, []);
    


    const fetchMatchesByDate = async () => {
        try {
            const date=today;
            //const response = await axios.get('http://localhost:8080/by-date', {
            const response = await axios.get( `https://ipl-voting-management-prod.onrender.com/by-date`,{
                params: { date },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const handleTeamClick = (teamName) => {
        console.log('Team clicked:', teamName);
    };

    return (
        <div>
            <h1 className='label'>Fetch Matches by Date</h1>
            
            <button  className='button' onClick={fetchMatchesByDate}>Fetch Matches </button>
            <ul>
                {matches.map(match => (
                    <li key={match.id}>
                        {today}: 
                        <button 
                            onClick={() => handleTeamClick(match.team1)} 
                            className="button"
                        >
                            {match.team1}
                        </button> 
                        vs 
                        <button 
                            onClick={() => handleTeamClick(match.team2)} 
                            className="button"
                        >
                            {match.team2}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MatchesByDate;
