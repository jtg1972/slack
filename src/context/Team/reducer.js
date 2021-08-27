import {ADD_TEAM} from './types';

const INITIAL_STATE={
    teams:[
        {id:1, name:'Team 1'},
        {id:2, name:'Team 2'},
        {id:3, name:'Team 3'},
    ]
}


const teamReducer=(state=INITIAL_STATE,{type,payload})=>{
    switch(type){
        case ADD_TEAM:
            return{
                ...state,
                teams:[...state.teams, payload]
            };
        default:
            return state;

    }

}

export default teamReducer;
export {INITIAL_STATE};