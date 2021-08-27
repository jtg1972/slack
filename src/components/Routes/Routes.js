import React from 'react';
import {BrowserRouter as Routers, Redirect, Route, Switch} from 'react-router-dom';
import Main from '../Main/Main';
import Register from '../Register/Register';
import Login from '../Login/Login';
import CreateTeam from '../CreateTeam/CreateTeam';
import DirectMessages from '../DirectMessages/DirectMessages';
import decode from 'jwt-decode';


const isAuthenticated=()=>{
    const token=localStorage.getItem('token');
    const refreshToken=localStorage.getItem('refreshToken');
    try{
        decode(token);
        const {exp}=decode(refreshToken);
        if(Date.now()/1000>exp){
            return false;
        }
        //decode(refreshToken);
        return true;
    }catch(e){
        return false;
    }
}


const PrivateRoute=({component:Component,...rest})=>{
    return <Route {...rest} render={props=>(
        isAuthenticated()?(
            <Component {...props}/>
        ):(
            <Redirect to="/login" />
        )
    )}/>
};



const Router=()=>{
    return(
    <Routers>
        <Switch>
            <PrivateRoute exact path="/view-team/:teamId?/:channelId?" component={Main}/>
            {/*<PrivateRoute exact path="/view-team/user/:teamId/:channelId" component={DirectMessages}/>*/}

            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <PrivateRoute exact path="/create-team" component={CreateTeam}/>
        </Switch>
    </Routers>
    );
}
export default Router;