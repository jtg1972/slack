import React, { useEffect,useState } from 'react';
import {gql,useQuery, useSubscription} from '@apollo/client';
import Chat from '../Chat/Chat';
import {Comment} from 'semantic-ui-react';
import Moment from 'react-moment';
import { subscribe } from 'graphql';
import FileUpload from '../FileUpload/FileUpload';
import { findByLabelText } from '@testing-library/dom';
import RenderText from '../RenderText/RenderText';
import {Button} from 'semantic-ui-react';
const GET_MESSAGES_QUERY=gql`query($channelId:Int!,$cursor:String){
    messages(channelId:$channelId,cursor:$cursor){
      id
      text
      user{
          username
      }
      createdAt
      url
      filetype
    }
  }
`;
const NEW_CHANNEL_MESSAGE=gql`
    subscription($channelId:Int!){
        newChannelMessage(channelId:$channelId){
            id
            text
            user{
                username
            }
            createdAt
            url
            filetype
        }
    }
`;

const Message=({message:{url,text,filetype}})=>{
    if(url){
        if(filetype){
            if(filetype.startsWith('image/')){
                return <img style={{width:"400px"}} src={url}/>
            }else if(filetype.startsWith('text/plain')){
                return <RenderText url={url}/>
            }else if(filetype.startsWith('audio/')){
                return <audio controls>
                    <source src={url} type={filetype}/>
                </audio>
            }
        }
    }

    return <Comment.Text>{text}</Comment.Text>
}


const MessageContainer=({channelId})=>{
    
    const [hasMoreItems,setHasMoreItems]=useState(true);
    console.log("cid",channelId);
    const td=(d)=>{
        console.log("d",typeof d);
        const nd=new Date(parseFloat(d));
        console.log("nd",nd.toDateString());
        return nd.toDateString();
    }
        

        const {data:data1}=useSubscription(NEW_CHANNEL_MESSAGE,
            {variables:{channelId}});
        //td();
        console.log("data1",data1);
    const {data,loading,subscribeToMore,fetchMore}=useQuery(GET_MESSAGES_QUERY,{
        variables:{             
            channelId:parseInt(channelId)
        }
        //fetchPolicy:"network-only"
    });
    console.log("data",data,subscribeToMore);
    let currentSubscribe=()=>{};
    
   
    

    useEffect(()=>{
       let unsubscribe;
       setHasMoreItems(true);
       unsubscribe=subscribeToMore({
            document:NEW_CHANNEL_MESSAGE,
            variables:{channelId},
            updateQuery:(prev,subscriptionData)=>{
                //setHasMoreItems(true);
                if(!subscriptionData){
                    return prev;
                }
                console.log("prev",prev);
                /*if(prev==null){
                    prev.messages=[];
                }*/

                console.log("Sdata",subscriptionData);
                const newFeedItem=subscriptionData.subscriptionData.data.newChannelMessage;
                console.log("nfi",newFeedItem);
                /*console.log("estado",{...prev,
                    messages:[...prev.messages,{...newFeedItem}]
                });*/
                if(prev!=null){
                    console.log("prevdnull",prev);
                    return {...prev,
                        messages:[{...newFeedItem},...prev.messages]
                    };
                }
                else{
                    return {
                        messages:[newFeedItem]
                    };
                }
            }
       });
       
       if(unsubscribe)
        return ()=>unsubscribe();
    },[channelId]);
     
    /*useEffect(()=>{
        console.log("variables",currentCI,channelId);
        currentSubscribe();
        currentSubscribe=()=>subscribe(channelId);
    },[channelId])
    
    /*console.log("datalo",data);
    console.log("DMM",data);
    */
    return loading?null:
    <div style={{
        textAlign:"left",
        gridColumn:3,
        gridRow:2,
        paddingLeft:"20px",
        paddingRight:"20px",
        display:"flex",
        overflowY:"auto"
    }}>
        <FileUpload disableClick
            style={{
            
                display:'flex',
                flexDirection:'column-reverse'
            }}
            channelId={channelId}
            disableClick
        >
        <Comment.Group>
            {hasMoreItems==true && <Button onClick={()=>{
                
                    fetchMore({
                        variables:{
                            channelId,
                            cursor:data.messages[data.messages.length-1].createdAt
                        },
                        updateQuery:(previousResult,{fetchMoreResult})=>{
                            console.log("fmrl",fetchMoreResult.messages.length);
                            console.log("pr",previousResult);
                            if(!fetchMoreResult){
                                return previousResult;
                            }else{
                                if(fetchMoreResult.messages.length<5){
                                    setHasMoreItems(false);

                                }
                                return {...previousResult,
                                messages:[...previousResult.messages,...fetchMoreResult.messages]};
                            }

                        }
                    });
                }}>Load more</Button>
            }
            {data.messages!=null?data.messages.slice().reverse().map(m => {
                return(
                <Comment key={`message-${m.id}`}>
                    <Comment.Content>
                        <Comment.Author>{m.user.username}
                        </Comment.Author>
                        <Comment.Metadata><Moment format="YYYY-MM-DD HH:mm" date={new Date(parseFloat(m.createdAt))}/>
                        </Comment.Metadata>
                        <Message message={m}/>
                        {/*m.url?<img style={{width:"400px"}}src={`http://localhost:3000/${m.url}`}/>:
                            <Comment.Text>
                                {m.text}
                              </Comment.Text>*/}
                    
                    </Comment.Content>
                </Comment>);
            }):""}
        </Comment.Group>
        </FileUpload>
    </div>
}

export default MessageContainer;
