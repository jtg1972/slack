import { PubSub, withFilter } from 'graphql-subscriptions';
import db from '../models/index.mjs';
import { authorizeTeamMember } from '../permissions.mjs';
import path from 'path';
import fs from 'fs';
//import {GraphQlUpload} from 'graphql-upload/public/GraphQLUpload.js';
import pkg1 from 'graphql-upload/public/GraphQLUpload.js';
import { GraphQLUpload } from 'graphql-upload';
const {GraphQlUpload} = pkg1;
//import { finished } from 'stream/promises';

//import GraphQLUpload from 'graphql-upload/public/GraphQLUpload.js';
//import { create } from 'lodash';
//const pubsub=new PubSub();
import {RedisPubSub} from 'graphql-redis-subscriptions';
const NEW_CHANNEL_MESSAGE="NEW_CHANNEL_MESSAGE";
const pubsub=new RedisPubSub({
    connection:{
        host:'127.0.0.1',
        port:6379,
        retry_strategy:options=>{
            return Math.max(options.attempt*100,300);
        }
    }
});
console.log("gqlupload",typeof GraphQLUpload,{...GraphQLUpload});


export default{
    Upload: {...GraphQlUpload},
    Message:{
        url:(parent)=>parent.url?`http://localhost:3000/${parent.url}`:parent.url,

        user:async(parent,args,context)=>{
            //console.log("parentmes",parent);
            return await db.User.findOne({where:{id:parent.userId}});
        }
    },
    Subscription:{
        newChannelMessage:{
            subscribe:withFilter(
                (parent,args,context)=>
                    /*const channel=await db.Channel.findOne({where:{id:args.channelId}});
                    const member=await db.Member.findOne({where:{
                        teamId:channel.teamId,
                        userId:context.user.id
                    }});
                    if(!member){
                        throw new Error("You have to be a member of the team to subscribe here");
                    }*/
                    //try{
                      //  console.log("*************************contextsubs",args.channelId,context);
                        //authorizeTeamMember(args.channelId,context);
                        pubsub.asyncIterator(NEW_CHANNEL_MESSAGE)
                    //}catch{
                      //  console.log("error................");
                    //}
                      
                    
                   
                 //}
                 ,
                
                (payload,args)=>{
                    console.log("payargs",payload,args)
                    return (payload.channelId===args.channelId);
                }
            ),
        },
    },

    Query:{
        him:()=>"String",
        messages:async(parent,args,context)=>{
            console.log("Entro mensajes*************",args,context);
            const channel=await db.Channel.findOne({where:{id:args.channelId}});
            if(!channel.public){
                const member=await db.PCMember.findOne({raw:true,
                    where:{channelId:args.channelId,
                        userId:context.user.id}});
                if(!member){
                    throw new Error("Not authorized");
                }
            }
                const options={
                    order:[['createdAt','DESC']],
                    where:{channelId:args.channelId},
                    limit:10
                };
                if(args.cursor){
                    console.log("dateemp", new Date(parseFloat(args.cursor)).toDateString());
                    options.where.createdAt={
                        [db.Sequelize.Op.lt]:parseFloat(args.cursor)
                    };
                }

            
                const messages=await db.Message.findAll(options,{raw:true});
                console.log("messages",messages);
                return messages;
                
                /*Pagination offset
                return await db.Message.findAll({order:[['createdAt','DESC']],
                    where:{channelId:args.channelId},
                    limit:5,
                    offset:args.offset
                });*/
            
        }
    },
    Mutation:{
        himm:()=>"Mutation",

        createFileMessage:async(parent,{file1,channelId},context)=>{
                console.log("filecfm",file1);
                
                const {filename,mimetype, encoding,createReadStream} = await file1.file;  
                console.log("Args",filename,mimetype,encoding,createReadStream);
                const stream=createReadStream();
                const pathName=`files/${filename}`;
                console.log("pathname",pathName);
                
                //const out = fs.createWriteStream(pathName);
                stream.pipe(fs.createWriteStream(pathName));
                //await finished(out);
                
                
                //stream.pipe(fs.createWriteStream(pathName));  
                const message=await db.Message.create(
                    {channelId:channelId,
                    filetype:mimetype,
                    url:pathName,
                    userId:context.user.id,
                    
                    },{raw:true});
                console.log("MEssagefile",message);
                console.log("url",message.url);
                
                return {url:pathName};
                
                
        },
        createMessage:async(parent,args,context)=>{
            
            
            try{
                    
                const messageData=args;
                console.log("channelid",args.channelId);
                if(args.file1){
                    console.log("filecfm",args.file1);
                
                    const {filename,mimetype, encoding,createReadStream} = await args.file1.file;  
                    console.log("Args",filename,mimetype,encoding,createReadStream);
                    const stream=createReadStream();
                    const pathName=`files/${filename}`;
                    console.log("pathname",pathName);
                    
        //const out = fs.createWriteStream(pathName);
                    await stream.pipe(fs.createWriteStream(pathName));
                    //await finished(out);
                    
                    
                    //stream.pipe(fs.createWriteStream(pathName));  
                    const message=await db.Message.create(
                        {channelId:args.channelId,
                        filetype:mimetype,
                        url:pathName,
                        userId:context.user.id,
                        
                        },{raw:true});
                    console.log("MEssagefile",message);
                    console.log("url",message.url);
                    pubsub.publish(NEW_CHANNEL_MESSAGE,
                        {newChannelMessage:message.dataValues,channelId:args.channelId});    
                    return true;
                }else{
    
                    console.log("MessageData",messageData);
                    console.log("args******************");
                    //const txt1=args.text?args.text:"";
                    
                    const message=await db.Message.create(
                        {channelId:args.channelId,
                        text:args.text,
                        userId:context.user.id});
                    pubsub.publish(NEW_CHANNEL_MESSAGE,
                            {newChannelMessage:message.dataValues,channelId:args.channelId});
                    return true;
                } 

                
            

            }catch(err){
                console.log("err",err);
                return false;
            }
        }
    }
};