import React, { useState,useEffect } from 'react';
import axios from 'axios';
 import '../styles/MatchByDate.css';

function MatchesByDate({ token, userID }) {
    const [today, setToday] = useState('');
    const [matches, setMatches] = useState([]);
    const [serverReponse, setServerReponse] = useState([]);


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

    const postVote = async (team, matchid) => {
        try {
            const jsonData = { 
                user_id: userID,
                match_id: matchid,
                voted_team_name:team  }; 
            
            //const response = await axios.post('http://localhost:8080/Insertvote', jsonData,{
            const response = await axios.post( `https://ipl-voting-management-prod.onrender.com/Insertvote`, jsonData,{
                

                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }, 
              
            });
            alert("Vote get saved successfull");
            if (response.status === 200) 
                {
                     setServerReponse("Success: Vote saved successfully"); 
                    } else
                    { 
                        setServerReponse("Failed: Unable to save vote"); }
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const handleTeamClick = async (teamName, matchid) => {
        console.log('Team clicked:', teamName); 
        await postVote(teamName,matchid);
      console.log('getTeamIDByName method called inside handleTeamClick');
      

    };

    return (
        <div  className="login-container">
            <h1 className='label'>Fetch Matches by Date</h1>
            
            <button  className='button' onClick={fetchMatchesByDate}>Fetch Matches </button>
            <ul>
                {matches.map(match => (
                    <li key={match.id}>
                          <h1 className='label'>Today's date </h1><br></br>{today}
                       <br></br>
                       <h1 className='label'>Today's match </h1>
                        <button 
                            onClick={() => handleTeamClick(match.team1,match.id)} 
                            className="button"
                        >
                            {match.team1}
                        </button> 
                        vs 
                        <button 
                            onClick={() => handleTeamClick(match.team2,match.id)} 
                            className="button"
                        >
                            {match.team2}
                        </button>
                    </li>
                ))}

            <h1>Vote for your Favorite Team</h1>
           <span> <h1 className='label'>E sala cup namde </h1></span>
            <img src='https://media.giphy.com/media/SvohqSY2NlobP1vYEh/giphy.gif?cid=790b7611j3bqm3tli1wmn87vdzdbo0g9sudez57sezh1jnud&ep=v1_gifs_search&rid=giphy.gif&ct=g'
            alt='RCB'
            width={300}></img>
            </ul>
            {serverReponse && ( <label>Server Response: {serverReponse}</label> )}
        </div>
    );
}

export default MatchesByDate;
