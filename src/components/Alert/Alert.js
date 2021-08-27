import React,{useState,useEffect} from 'react';

import './Alert.css';

const Alert = ({open, text,h }) => {
    console.log("open",open);
    return (
        <div className={open ? 'alert-close alert-show' : 'alert-close'} style={{top:h+"px"}}>{text}</div>  
     );
}

export default Alert;
