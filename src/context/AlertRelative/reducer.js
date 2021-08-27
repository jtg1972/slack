import {ADD_RELATIVE_ALERT, CLEAR_RELATIVE_ALERTS, SHOW_RELATIVE_ALERTS} from './types';

const INITIAL_STATE = {
    showRelativeAlerts:false,
    relativeAlerts:[],
    relativeAlert:{}};

const AlertRelativeReducer = (state = INITIAL_STATE, {type, payload}) => {
    console.log("stateglobal",state);
    switch(type) {
        case ADD_RELATIVE_ALERT:
            return {
                ...state,
                relativeAlerts:[...state.relativeAlerts, payload]
            };
        case SHOW_RELATIVE_ALERTS:
            return {
                ...state,
                showRelativeAlerts:true
            };
        case CLEAR_RELATIVE_ALERTS:
            return INITIAL_STATE;
        default:
            return state;
    };
    

};


export {INITIAL_STATE, AlertRelativeReducer};