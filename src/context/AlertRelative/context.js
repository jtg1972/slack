import React, {createContext, useReducer} from 'react';
import {AlertRelativeReducer, INITIAL_STATE} from './reducer';


const AlertRelativeContext = createContext();

function AlertRelativeProvider({children}){

    

    const [state,dispatch]=useReducer(AlertRelativeReducer,INITIAL_STATE);


    return (
        <AlertRelativeContext.Provider value={{alertRelativeState:state, alertRelativeDispatch:dispatch}}>
            {children}
        </AlertRelativeContext.Provider>);
    
};
export default AlertRelativeContext;
export {AlertRelativeProvider};

