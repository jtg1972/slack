import React,{useContext, useEffect, useState}from 'react';
import styled from 'styled-components';
import Header from '../Header/Header'
import Chat from '../Chat/Chat'
import Message from '../Message/Message';
import Dialog from '../Dialog/Dialog';
import Black from '../Black/Black';
import AlertTopLeft from '../Alert/Alert';
import AlertContext from '../../context/Alert/context';

import AlertGroup from '../AlertGroup/AlertGroup';
import AlertForm from '../AlertForm/AlertForm';
import Sidebar from '../containers/Sidebar';
import ME_QUERY from '../../graphql/meQuery';
import { useQuery } from '@apollo/client';
import {gql,useMutation} from '@apollo/client';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';
import MessageContainer from '../containers/MessageContainer';
const Layout=styled.div`
    height:100vh;
    display:grid;
    grid-template-rows:auto 1fr auto;
    grid-template-columns:100px 250px 1fr;
`;

const MainL=styled.div`
    position:relative;
    height:100vh;
    
`;

const DialogL=styled.div`
    position:absolute;
    top:calc((100vh - 100px) / 2);
    left:calc((100vw - 150px) / 2);
 
    width:150px;
    height:100px;
    
    
    border:1px solid red;
`;

const CREATE_MESSAGE_MUTATION=gql`
    mutation($channelId:Int!,$text:String){
        createMessage(channelId:$channelId,text:$text)
    }
`;

const Main = ({match:{params:{teamId,channelId}}})=> {
   //console.log("Match",props);
    //const {teamState:{teams}} = useContext(TeamContext);
    /*const [openAddTeamDialog,setOpenAddTeamDialog]=useState(false);
    const [openAddTeamAlert, setOpenAddTeamAlert] = useState(false);
    const {alertState, alertDispatch} = useContext(AlertContext);
    const {alerts, showAlerts} = alertState;
    console.log("alerts",alerts);
    console.log("showalert",showAlerts);

    const [sAlerts,setSAlerts]=useState(alerts);
    const [sshowAlerts,setSShowAlerts]=useState(showAlerts);
    */

    //empiezan variables de alertgroup

    /*const initial=[];
    const [alertsStates,setAlertsStates]=useState(initial);
    const [openIndex,setOpenIndex]=useState(-1);
    */
    

    //terminan variables de alertgroup

   /*useEffect(()=>{
        alertDispatch({type:'ADD_ALERT',payload:{ id:0, type:'SUCCESS', text:'Primer alert'}});
        alertDispatch({type:'ADD_ALERT', payload:{ id:1, type:'SUCCESS', text:'Segundo alert'}});
        alertDispatch({type:'ADD_ALERT', payload:{ id:2, type:'SUCCESS', text:'Tercer alert'}});
        alertDispatch({type:'ADD_ALERT', payload:{ id:2, type:'SUCCESS', text:'Cuarto alert'}});
        alertDispatch({type:'ADD_ALERT', payload:{ id:2, type:'SUCCESS', text:'Quinto alert'}});
    },[]);*/

    /*const toggleAddTeamAlert = () => {
        //alertDispatch({type:'SHOW_ALERTS'});
        setOpenAddTeamAlert(true);
        
    };

    const duracionAlert=()=>{
        setTimeout(()=>{setOpenAddTeamAlert(false);},3000);
    };*/


   
    /*const closeDialog1 = () =>{

       setOpenAddTeamDialog(false);
    };

    const open= () => {
        setOpenAddTeamDialog(true)
    };

    const openAlertGroup=()=>{
        setOpenAddTeamAlert(true);
    };

    const closeAlertGroup=()=>{
        setOpenAddTeamAlert(false)
    };
    
    const eachAlert = (alert,index) => {
        console.log(alert,"ai");
        //setTimeout(()=>{},3000);
        return (<AlertTopLeft key={index} duracionAlert={duracionAlert} text={alert.text} open={openAddTeamAlert} toggleAlert={toggleAddTeamAlert}/>);
    };

    //funciones de alertgroup

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
        
    }


    //termina funciones de alertgroup

    */   
    const [mutat1]=useMutation(CREATE_MESSAGE_MUTATION);
    const {data,loading}=useQuery(ME_QUERY,{fetchPolicy:"network-only",nextFetchPolicy:'network-only'});  
    console.log("dataaaa",data, loading);
    if(loading)
        return null;
    console.log("datms",data.me.teams);
    const {id:currentUserId,teams,username}=data.me  
    
    if(!teams.length){
        return <Redirect to="/create-team"/>
    } 

    console.log("vars",teamId,channelId);
    const teamIdInteger=parseInt(teamId,10);
    const teamIdx=teamIdInteger?_.findIndex(teams,['id',teamIdInteger]):0;
    const team=teamIdx==-1?teams[0]:teams[teamIdx];
    console.log("team",team);
    const channelIdInteger=parseInt(channelId,10);
    const channelIdx=channelIdInteger?_.findIndex(team.channels,['id',channelIdInteger]):0;
    const channel=channelIdx==-1?team.channels[0] : team.channels[channelIdx];
    console.log("channelIDx",channelIdInteger,channelIdx);
    
    console.log("cregister",channel);
    
    return (
        <div className="App">
    
            <MainL>
                <Layout>
                    <Sidebar allTeams={teams} 
                    team={team}
                    username={username}
                    currentUserId={currentUserId}/>
                    <Header channelName={channel.name}/>
                    
                    <MessageContainer channelId={channel.id}></MessageContainer>
                    <Message placeholder={channel.name} 
                    channelId={channel.id}
                    onSubmit1={async(text)=>{
                        console.log("paramscon",channel.id,text);
                        await mutat1({
                        variables:{
                            channelId:channel.id,
                            text

                        }
                    })}}/>
                </Layout>
            
                {/*<Dialog open={openAddTeamDialog} close={closeDialog1} openAlert={toggleAddTeamAlert} w="400px" h="200px" c="white">
                    
                    <AlertForm openAlertGroup={openAlertGroup} closeDialog1={closeDialog1} handleClick={handleClick}/>        
                </Dialog>
                {openAddTeamAlert?<AlertGroup alerts={alertState.alerts} alertsStates={alertsStates} openIndex={openIndex}/>:""}
                {alerts.map(eachAlert)}
                </div>*/}
            </MainL>
        </div>
    );
}
export default Main;