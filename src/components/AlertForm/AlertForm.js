import React, {useState, useContext} from 'react';
import { findRenderedComponentWithType } from 'react-dom/test-utils';
import alertRelativeContext from '../../context/AlertRelative/context';
import alertContext from '../../context/Alert/context';
import RelativeAlert from '../RelativeAlert/RelativeAlert';

const AlertForm = ({closeDialog1, openAlertGroup,closeAlertGroup,handleClick}) => {
    const [alert,setAlert] = useState("");
    const {alertDispatch} = useContext(alertContext);
    const {alertRelativeDispatch, alertRelativeState} = useContext(alertRelativeContext);
    const [alerts,setAlerts] = useState([])
    const addAlert = ()=>{
        setAlerts([]);
        if(alert==""){

            setAlerts([{text:"NO PUEDE ESTAR VACIO"}]);
            
        }
        if(alert.length<3)
                 setAlerts((value)=>[...value,{text:"TIENE QUE SER MAYOR A DOS CARACTERES"}]);
        else{
            alertDispatch({type:'ADD_ALERT', payload:{text:alert,type:'SUCCESS'}});
            setAlert("");
        }
    };
    const cerrar =  () => {
        closeDialog1();
        openAlertGroup();
        handleClick(0);
    };

    const abrirRelativeAlerts = () => {

    }

    return (
        
            <div style={{position:"relative", overflowY:"auto"}}>
                <h3>Crear Alertas</h3>
                
               
                {alerts.map(alert1=><RelativeAlert text={alert1.text}/>)}
                <input name="alert" value={alert} onChange={(e)=>setAlert(e.target.value)}/>
                <button onClick={addAlert}>Crear la alert</button>
                <button onClick={()=>cerrar()}>Cerrar</button>
                
            </div>
        
    );
}

export default AlertForm;