import React, { useEffect } from 'react';
import {gql,useQuery, useSubscription} from '@apollo/client';
import Chat from '../Chat/Chat';
import {Comment} from 'semantic-ui-react';
import Moment from 'react-moment';
//import { subscribe } from 'graphql';
const DIRECT_MESSAGES_QUERY=gql`query($teamId:Int!,$receiverId:Int!){
    directMessages(teamId:$teamId,receiverId:$receiverId){
      id
      text
      sender{
          username
      }
      createdAt
    }
  }
`;
const NEW_DIRECT_MESSAGE_SUBSCRIPTION=gql`
    subscription($teamId:Int!,$userId:Int!){
        newDirectMessage(teamId:$teamId,userId:$userId){
            id
            text
            sender{
                username
            }
            createdAt
        }
    }
`;

const DirectMessageContainer=({teamId,channelId})=>{
    //console.log("cid",channelId);
    const td=(d)=>{
        console.log("d",typeof d);
        const nd=new Date(parseFloat(d));
        console.log("nd",nd.toDateString());
        return nd.toDateString();
    };
        

        /*const {data:data1}=useSubscription(NEW_CHANNEL_MESSAGE,
            {variables:{channelId}});
        //td();
        console.log("data1",data1);*/
        //console.log("paramsdm",teamId,userId);
        /*const {data,loading}=useQuery(DIRECT_MESSAGES_QUERY,{
            variables:{
                teamId:parseInt(teamId),
                receiverId:parseInt(userId)
            },
            fetchPolicy:"network-only"
        });

        console.log("DATADM",data);*/
        /*bien const {data,loading,subscribeToMore}=useQuery(DIRECT_MESSAGES_QUERY,{
            variables:{
                teamId:parseInt(teamId),
                receiverId:parseInt(userId)
            },
            fetchPolicy:"network-only"
            
        });bien*/
    //console.log("data3444",data);
    let currentSubscribe=()=>{};
    
    
    

    /*bienuseEffect(()=>{
       console.log("*****************Entro useeff",teamId,userId);
       let unsubscribe=null;
       unsubscribe=subscribeToMore({
            document:NEW_DIRECT_MESSAGE_SUBSCRIPTION,
            variables:{
                teamId:parseInt(teamId),
                userId:parseInt(userId)
            },
            updateQuery:(prev,subscriptionData)=>{
                console.log("entroudatequery");
                if(!subscriptionData){
                    return prev;
                }
                console.log("Sdata",subscriptionData);
                const newFeedItem=subscriptionData.subscriptionData.data.newDirectMessage;
                console.log("nfi",newFeedItem);
                console.log("estado",{...prev,
                    directMessages:[...prev.directMessages,{...newFeedItem}]
                });
                return {...prev,
                    directMessages:[...prev.directMessages,{...newFeedItem}]
                };
            }
       });
       if(unsubscribe)
        return ()=>unsubscribe();
    },[userId]);bien*/
     
    /*console.log("datalo",data);
    console.log("DMM",data);
    */
    return null;/*loading?null:<Chat
    channelId={userId}>
        <Comment.Group>
            {data.directMessages.map(m => {
                return(
                <Comment key={`message-direct-message-${m.id}`}>
                    <Comment.Content>
                        <Comment.Author>{m.sender.username}
                        </Comment.Author>
                        <Comment.Metadata><Moment format="YYYY-MM-DD HH:mm" date={new Date(parseFloat(m.createdAt))}/>
                        </Comment.Metadata>
                        <Comment.Text>
                            {m.text}
                        </Comment.Text>
                    </Comment.Content>
                </Comment>);
            })}
        </Comment.Group>
        
    </Chat>bien */
}

export default DirectMessageContainer;
