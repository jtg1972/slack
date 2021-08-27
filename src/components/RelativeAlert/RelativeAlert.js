import React from 'react';
import './RelativeAlert.css'

const RelativeAlert = ({text}) => {
    console.log("text",text);
    
    return (
        <div className="alert-show-r">{text}</div>  
     )
}

export default RelativeAlert;
