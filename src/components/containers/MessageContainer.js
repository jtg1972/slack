import React, { useRef,useEffect,useState } from 'react';
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
    const scrollRef=useRef();
    let insertar=false;
    const [primero,setPrimero]=useState(true);
    //const [hasMoreItems,setHasMoreItems]=useState(true);
    //const [menorACien,setMenorACien]=useState(false);
    //const [dataVar,setDataVar]=useState([]);
    const [nuevo,setNuevo]=useState(false);
    let mac=true;
    
    let tm=true;
    let hmi=true;
    let dataVar;
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
        },
        fetchPolicy:"network-only",
        nextFetchPolicy:"cache-first"
        
    });
    
    if(!loading){
        dataVar=[...data.messages];
        console.log("datavar1",dataVar);
    }    
    
    

    useEffect(()=>{
       let unsubscribe;
        //hmi=true;
       //setHasMoreItems(true);
       unsubscribe=subscribeToMore({
            document:NEW_CHANNEL_MESSAGE,
            variables:{channelId},
            updateQuery:(prev,subscriptionData)=>{
                //setHasMoreItems(true);
                if(!subscriptionData){
                    return prev;
                }
                setNuevo(true);
                //insertar=true;
                //console.log("insertar a true");
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
                    console.log("asigne asigne asigne");
                                        
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
       
       /*
       }*/
       if(unsubscribe)
        return ()=>unsubscribe();
    },[channelId]);

    useEffect(()=>{
        if(!loading && dataVar.length>0 && data.messages.length>0){
            
                //if(dataVar[0].id==data.messages[1].id){
                if(nuevo==true){
                    //console.log("useefdvdmdif",dataVar[0].id,data.messages[1].id);
                    if(scrollRef){
                        scrollRef.current.scrollTop=1;
                        
                    }
                    setNuevo(false);
                }
                else{
                    console.log("useefdvdmig",dataVar[0].id,data.messages[0].id);
                }
                
            
        }
    },[data]);

    /*useEffect(()=>{
         if(!loading){
             console.log("dvl,dml",dataVar.length,data.messages.length);
            if(data.messages.length>10){
             if(dataVar.length!=data.messages.length && hmi==false){
                if(scrollRef!=null || scrollRef!=undefined){
                    let currentHeight=scrollRef.current.scrollHeight;
                    console.log("ch",currentHeight)
                    setTimeout(()=>{
                        let suma=scrollRef.current.scrollTop+scrollRef.current.scrollHeight+currentHeight;
                        
                        scrollRef.current.scrollTop=suma;
                        /*{
                            scrollRef.current.scrollTop=scrollRef.current.clientHeight-scrollRef.current.scrollHeight;
                        }else{
                            scrollRef.current.scrollTop=scrollRef.current.scrollHeight-currentHeight-scrollRef.current.clientHeight;
                        }
                        //setMenorACien(true);
                        mac=true;
                        //setDataVar(data.messages) 
                        dataVar=data.messages;              
                    },1000);
                }
                
            }
        }
        }
    },[data]);*/
    
    const handleScroll=()=>{
        /*if(primero){
            scrollRef.current.scrollTop=scrollRef.current.scrollHeight;       
            setPrimero(false);
        }*/
        
        console.log("St", scrollRef.current.scrollTop,
        scrollRef.current.scrollHeight,
        scrollRef.current.clientHeight,
        scrollRef.current.scrollTop+scrollRef.current.scrollHeight);
        //setMenorACien(scrollRef.current.scrollTop<=100);
        /*if(scrollRef && scrollRef.current.scrollTop+scrollRef.current.scrollHeight<=scrollRef.current.clientHeight+100
            && mac==true && hmi==true &&
            data.messages.length>=10)*/
        hmi=data.messages.length>=10;
        if(scrollRef && 
            scrollRef.current.scrollTop+scrollRef.current.scrollHeight<=scrollRef.current.clientHeight+100
            && mac==true &&
            hmi==true &&
            data.messages.length>=10){


            //setMenorACien(false);    
            mac=false;
            console.log("reached top");
        
        /*if(scrollRef && 
        (menorACien==true) &&
        hasMoreItems &&
        data.messages.length>=10){
        */                
            //console.log("reached top");
            console.log("Hmi",hmi);
            if(hmi){
            fetchMore({
                variables:{
                    channelId,
                    cursor:data.messages[data.messages.length-1].createdAt
                },
                updateQuery:(previousResult,{fetchMoreResult})=>{
                    console.log("fmrl",fetchMoreResult);
                    console.log("pr",previousResult);
                    /*if(fetchMoreResult==[]){
                        console.log("NULLLLLLLLLLLLL");
                        setHasMoreItems(false);
                        return previousResult;
                        
                    }else{*/
                        
                        if(fetchMoreResult.messages.length<10 &&
                            fetchMoreResult.messages.length>=0){
                            console.log("llego al final");
                            //setHasMoreItems(false);
                            hmi=false;
                            
                            
                            return {...previousResult,
                                messages:[...previousResult.messages,...fetchMoreResult.messages]};
        
                        }else{
                            console.log("hay 10 elementos");
                            hmi=true;
                            return {...previousResult,
                            messages:[...previousResult.messages,...fetchMoreResult.messages]};
                        }
                    /*}*/
                    
                }
            });
          
        }
        
         
        }
    }
    /*useEffect(()=>{
        console.log("variables",currentCI,channelId);
        currentSubscribe();
        currentSubscribe=()=>subscribe(channelId);
    },[channelId])
    
    /*console.log("datalo",data);
    console.log("DMM",data);
    */

    if(loading) return null;
    console.log("data",data.messages,subscribeToMore);
    let currentSubscribe=()=>{};
    
    return loading?null:
    <div style={{
        textAlign:"left",      
        gridColumn:3,
        gridRow:2,
        paddingLeft:"20px",
        paddingRight:"20px",
        display:"flex",
        overflowY:"auto",
        flexDirection:"column-reverse"

    }}
    onScroll={()=>{
        handleScroll();
    }}
    ref={scrollRef}
    >
        <FileUpload disableClick
            style={{
                //backgroundColor:'red',
                display:'flex',
                flexDirection:'column-reverse'
                
            }}
            channelId={channelId}
            disableClick
        >
    <Comment.Group>
            
            {data.messages!=null?data.messages.slice().reverse().map(m => {
                return(
                <Comment key={`message-${m.id}`}>
                    <Comment.Content>
                        <Comment.Author>{m.user.username} {m.id}
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
