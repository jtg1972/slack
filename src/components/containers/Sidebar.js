import React,{Fragment,useEffect,useState} from 'react';
import {useQuery,gql} from '@apollo/client';
import Team from '../Team/Team';
import Channel from '../Channel/Channel';
import _ from 'lodash';
import decode from 'jwt-decode';
import AddChannelModal from '../AddChannelModal/AddChannelModal';
import AddInvitePeopleModal from '../AddInvitePeopleModal/AddInvitePeopleModal';
import DirectMessageModal from '../DirectMessageModal/DirectMessageModal';
import ALL_TEAMS_QUERY from '../../graphql/meQuery';
/*const ALL_TEAMS_QUERY=gql`
    query{
        allTeams{
            ok
            teams{
                id
                owner
                name
                channels{
                    id
                    name
                    teamId
                }
            
            }
            errors{
                path
                message
            }
        } 

    }
    
`;*/

const Sidebar=({allTeams, team,username,currentUserId})=>{
    /*const[currentTeam,setCurrentTeam]=useState(0);
    let response;*/
    const [openAddChannelModal,setOpenAddChannelModal]=useState(false);
    const [openInvitePeopleModal,setOpenInvitePeopleModal]=useState(false);
    const [openDirectMessageModal,setOpenDirectMessageModal]=useState(false);



    /*let { data,loading }=useQuery(ALL_TEAMS_QUERY);
    console.log(data);*/

    /* va dentro de Team para dialog alert
                    toggleDialog={open} 
                    toggleAlert={toggleAddTeamAlert}
                 
    if(loading)
        return null;*/
    
    console.log("teamsas",allTeams);
    /*let teams=data.allTeams.teams;
    let teamIdx=currentTeamId?_.findIndex(teams,['id',parseInt(currentTeamId,10)]):0;
    let team=teams[teamIdx];
    const {name}=team;*/

    console.log("teamas",team);
    /*console.log("teamchannels",team.channels);
    */let user;
    /*let username;
    let isOwner=false;
    try{
        const token=localStorage.getItem("token");
        user=decode(token).user;
        //console.log("User",user);
        username=user.username;
        
        console.log("Username",username);
    }catch(err){}
    */
   const toggleDirectMessageModal=(e)=>{
       if(e){
           e.preventDefault();
       }
       setOpenDirectMessageModal(val=>!val);
   }
    
    const toggleAddChannelModal=(e)=>{
        if(e){
            e.preventDefault();
        }
        setOpenAddChannelModal(val=>!val);
    }

    const toggleInvitePeopleModal=(e)=>{
        if(e){
            e.preventDefault();
        }
        setOpenInvitePeopleModal(val=>!val);
    }
    const regularChannels=[];
    const dmChannels=[];
    team.channels.forEach(c=>{
        if(c.dm){
            dmChannels.push(c);
        }else{
            regularChannels.push(c);
        }
    });
    return [
            <Team
                key="team-sidebar" 
                teams={allTeams.map(t=>
                    ({id:t.id,letter:t.name.charAt(0).toUpperCase()}))}
                />,

            
            <Channel 
                key="channel-sidebar"
                teamId={team.id}
                isOwner={team.admin}
                teamName={team.name} 
                userName={username}
                regularChannels={regularChannels.map(c=>({
                    id:c.id,
                    name:c.name
                }))}
                dmChannels={dmChannels.map(c=>({
                    id:c.id,
                    name:c.name
                }))}
                users={team.directMessageMembers}
                onAddChannelClick={toggleAddChannelModal}
                onInvitePeopleClick={toggleInvitePeopleModal}
                onDirectMessageClick={toggleDirectMessageModal}
                
                />,
            <DirectMessageModal
                open={openDirectMessageModal}
                teamId={team.id}
                onClose={toggleDirectMessageModal}
                key="sidebar-direct-message-modal"
                currentUserId={currentUserId}
            />,
            
            <AddChannelModal 
                open={openAddChannelModal}
                teamId={team.id}
                onClose={toggleAddChannelModal}
                key="sidebar-add-channel-modal"
                currentUserId={currentUserId}/>,
            <AddInvitePeopleModal
                key="sidebar-add-invite-people-modal"
                open={openInvitePeopleModal}
                teamId={team.id}
                
                onClose={toggleInvitePeopleModal}
                />
        ]
    ;
    
    
    
}

export default Sidebar;