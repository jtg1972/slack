import React, {useContext, useEffect,useState} from 'react';
import AlertContext from'../../context/Alert/context'


import Alert from '../Alert/Alert';
import { GET_ALERT } from '../../context/Alert/types';

const alertBlock=(alert,index)=>{
    return (<div className="asdf" key={index}>{alert.text}</div>);
}

const AlertGroup = ({alerts,alertsStates,openIndex}) => {

    /*const {alertState}=useContext(AlertContext);

    const initial=[false,false,false,false,false];
    const [alertsStates,setAlertsStates]=useState(initial);
    const [openIndex,setOpenIndex]=useState(-1);

    useEffect(()=>{handleClick(0)
        return ()=>closeAlertGroup()},[]);

    useEffect(()=>{
        if(open==true)
            handleClick(0);
        return ()=>{
            closeAlertGroup();
        }
    },[open]);

    const setAlertsStatesIndex=(i,value)=>{
        console.log("value",value);
        
        setOpenIndex(i);
        
        const finalState=alertState.alerts.map((alert,index)=>{
            
        if(index==i)
            return value;
        else
            return alertsStates[index]});
            
            
        console.log("finalstate",finalState);
        setAlertsStates(finalState);
        console.log("alertsstates",alertsStates);
        
    }

    const resetState=()=>{
        
        setOpenIndex(-1);
        setAlertsStates(initial);
        
    }

    
    const handleClick=(index) =>{
        
        setAlertsStatesIndex(index,true);
        
        setTimeout(()=>{
            setAlertsStatesIndex(index,false);
            if(index+1<alertState.alerts.length)
                handleClick(index+1);
        },3000);
        
        if(index==alertState.alerts.length-1)
            setTimeout(()=>{
                resetState();
            },5000);
        
    }*/


    return (
        <div>
            {alerts.map((alert,index)=>
                (((index-1)==(openIndex)) || (index==openIndex) || ((index+1)==openIndex))?<Alert 
                    key={index}
                    h={index*30} 
                    text={alert.text} 
                    open={alertsStates[index]}
                />:"")}

        
            
        {/*<button onClick={()=>{handleClick(0);}}>Presenta</button> */}
        
    </div>)
    /*(
        //alerts.map((alert,index)=><Alert open={true} text={alert.text} stylet={`transition:all 2s ease-in-out ${index*4}s`}/>)
    );*/
}

export default AlertGroup;