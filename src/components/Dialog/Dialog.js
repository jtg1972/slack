import React from 'react';
import styled from 'styled-components';
import Black from '../Black/Black';
import AlertForm from '../AlertForm/AlertForm';

const DialogL=styled.div`
    position:absolute;
    width:${props => props.w};
    height:${props => props.h};
    top:${props => `calc((100% - ` + props.h + `) / 2);`};
    left:${props =>`calc((100% - `+ props.w + `) / 2);`};
    text-aligh:center;
    border:1px solid black;
    z-index:8;
    background-color:${props=>props.c};
    color:black;
    overflow:auto;
`;
//calculate((100%-300px)/2);
//calculate((100%-500px)/2);

const Pop=({close,w,h,c, openAlert,children})=>{
    const oc=()=>{
        console.log('aqui');
        close();
        openAlert();
        //handleClick();
    };
    return(
    <div>
        <Black/>
        <DialogL w={w} h={h} c={c}> 
            {children}
        </DialogL>
    </div>);
};

const Dialog= ({open, close, w, h, c, openAlert,children}) => {
    return open?<Pop openAlert={openAlert} close={close} w={w} h={h} c={c}>
            {children}
        </Pop>:null;
        
    
}

export default Dialog; 