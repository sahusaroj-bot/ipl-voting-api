import React, { useState } from 'react';
import axios from 'axios';

function MatchesByDate({ token }) {
    const [date, setDate] = useState('');
    const [matches, setMatches] = useState([]);

    const fetchMatchesByDate = async () => {
        try {
            const response = await axios.get(`https://ipl-voting-management-prod.onrender.com/getMatcheByDate`, {
           // const response = await axios.get(`http://localhost:8080/getMatcheByDate`, {
                params:{date},
                headers: {
                     Authorization: `Bearer ${token}`
                     }
            });
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    return (
        <div>
            <h2>Fetch Matches by Date</h2>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={fetchMatchesByDate}>Fetch Matches</button>
            <ul>
                {matches.map(match => (
                    <li key={match.id}>
                        {new Date(match.date).toLocaleDateString()}: {match.team1} vs {match.team2}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MatchesByDate;
