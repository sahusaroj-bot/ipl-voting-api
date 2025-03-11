import React, { useState, useEffect } from 'react';

function PreviousResult({token, userID,name}){
    return (
        <div>
            <h1>Previous Result</h1>
            <h2>my name is saroj {name}</h2>
            <h2>{userID}</h2>
            <h2>{token}</h2>
        </div>
    );
}
export default PreviousResult;