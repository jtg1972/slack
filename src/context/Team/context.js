import React, {createContext, useReducer} from 'react';
import teamReducer from './reducer';

const TeamContext = createContext();

function TeamProvider({children}){

    

    const [state,dispatch]=useReducer(teamReducer,{teams:[
        {id:1, name:'Team 1'},
        {id:2, name:'Team 2'},
        {id:3, name:'Team 3'},
    ]});


    return (
        <TeamContext.Provider value={{teamState:state, teamDispatch:dispatch}}>
            {children}
        </TeamContext.Provider>);
    
};
export default TeamContext;
export {TeamProvider};

