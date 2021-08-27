import React, {createContext, useReducer} from 'react';
import {AlertReducer, INITIAL_STATE} from './reducer';


const AlertContext = createContext();

function AlertProvider({children}){

    

    const [state,dispatch]=useReducer(AlertReducer,INITIAL_STATE);


    return (
        <AlertContext.Provider value={{alertState:state, alertDispatch:dispatch}}>
            {children}
        </AlertContext.Provider>);
    
};
export default AlertContext;
export {AlertProvider};

