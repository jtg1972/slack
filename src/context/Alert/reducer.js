import {ADD_ALERT, CLEAR_ALERTS, SHOW_ALERTS, GET_ALERT} from './types';

const INITIAL_STATE = {
    showAlerts:false,
    alerts:[],
    alert:{}};

const AlertReducer = (state = INITIAL_STATE, {type, payload}) => {
    console.log("stateglobal",state);
    switch(type) {
        case ADD_ALERT:
            return {
                ...state,
                alerts:[...state.alerts, payload]
            };
        case SHOW_ALERTS:
            return {
                ...state,
                showAlerts:true
            };
        case CLEAR_ALERTS:
            return INITIAL_STATE;
        case GET_ALERT:
            const alert=state.alerts.filter(alert=>alert.id==payload);
            
            if(alert!=null)
                return {...state,alert:alert};
            else
                return {...state, alert:{}};
        default:
            return state;
    };
    

};


export {INITIAL_STATE, AlertReducer};