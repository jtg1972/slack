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
import ME_QUERY,{DIRECT_MESSAGE_ME_QUERY} from '../../graphql/meQuery';
import { useQuery } from '@apollo/client';
import {gql,useMutation} from '@apollo/client';

import _ from 'lodash';
import {Redirect} from 'react-router-dom';
import DirectMessageContainer from '../containers/DirectMessageContainer';
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

const CREATE_DIRECT_MESSAGE_MUTATION=gql`
    mutation($receiverId:Int!,$text:String!,$teamId:Int!){
        createDirectMessage(receiverId:$receiverId,text:$text,teamId:$teamId)
    }
`;

const DirectMessages = ({match:{params:{teamId,channelId}}}) => {
    console.log("asdfasdfasdf",teamId/*,userId*/);
    const [mutat1]=useMutation(CREATE_DIRECT_MESSAGE_MUTATION);
    const {data,loading}=useQuery(ME_QUERY,{fetchPolicy:"network-only"}); 
    /*const {data:data2,loading:loading2}=useQuery(DIRECT_MESSAGE_ME_QUERY,{
        variables:{userId:parseInt(userId)}
    });*/
    if(/*loading2 ||*/ loading){
        return null;
    }
    //console.log("data2",data2.getUser);
    console.log("dataaaa",data, loading);
    if(loading)
        return null;
    console.log("datms",data.me.teams);
    const {teams,username}=data.me  
    
    if(!teams.length){
        return <Redirect to="/create-team"/>
    } 
    const teamIdInteger=parseInt(teamId,10);
    const teamIdx=teamIdInteger?_.findIndex(teams,['id',teamIdInteger]):0;
    const team=teamIdx==-1?teams[0]:teams[teamIdx];

    const channelIdInteger=parseInt(channelId,10);
    const channelIdx=channelIdInteger?_.findIndex(team.channels,['id',channelIdInteger]):0;
    const channel=channelIdx==-1?team.channels[0]:team.channels[channelIdx];
   return (
        <div className="App">
    
            <MainL>
                <Layout>
                    <Sidebar allTeams={teams} 
                    team={team}
                    username={username}/>
                    <Header channelName={channel.name}/>
                   <DirectMessageContainer
                        //userId={userId}
                        channelId={channelId}
                        teamId={team.id}
                        />
                    <Message onSubmit1={async(text)=>{
                        //console.log("argsmessage",text,userId,teamId);
                        return null;/*await mutat1({
                                variables:{receiverId:parseInt(userId),text,teamId:parseInt(teamId)},
                                optimisticResponse:{
                                    createDirectMessage:true,
                                },
                
                                update:(cache)=>{
                                    const at=cache.readQuery({query:ME_QUERY});
                                    console.log("at",at);
                                    const idx=_.findIndex(at.me.teams,['id',parseInt(team.id)]);
                                    console.log("params",at.me.teams,idx)
                                    //at.allTeams.teams[idx].channels.push(createChannel);
                                    const notAlreadyThere=true;
                                    //at.me.teams[idx].directMessageMembers.every(member=>member.id!=parseInt(userId));  
                                    
                                    const primeros=at.me.teams.filter((team,index)=>{
                                        return index<idx;
                                    });
                                    const x=at.me.teams[idx];
                                    const ultimos=at.me.teams.filter((team,index)=>{
                                        return index>idx;
                                    });
                                    //console.log("chtype",createChannel.channel);
                                    //const newData={...at,me:{...at.me,teams:[...primeros,
                                    //    {...x,
                                    //        channels:[...x.channels,
                                    //                {...createChannel.channel}
                                    //                ]},
                                    //                ...ultimos]}};
                                    //console.log("newdata",newData);
                                    if(notAlreadyThere){
                                    cache.writeQuery({query:ME_QUERY,
                                        data:{...at,me:{
                                            ...at.me,teams:[...primeros,
                                                            {...x,
                                                                directMessageMembers:[...x.directMessageMembers,
                                                                    {
                                                                        __typename:"User",
                                                                        id:parseInt(userId),
                                                                        username:data2.getUser.username
                                                                    }
                                                            ]},
                                                    ...ultimos]
                                            }
                                        }
                                    });
                                    }
                                }
                            }
                            );*/
                        }} 
                        placeholder={channel.name}/>
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
export default DirectMessages;