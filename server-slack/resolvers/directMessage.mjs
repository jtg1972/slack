
import db from '../models/index.mjs';
import { PubSub, withFilter } from 'graphql-subscriptions';
const pubsub=new PubSub();
const NEW_DIRECT_MESSAGE="NEW_DIRECT_MESSAGE";
export default{

    Subscription:{
        newDirectMessage:{
            subscribe:withFilter(
                ()=>
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
                        pubsub.asyncIterator(NEW_DIRECT_MESSAGE)
                    //}catch{
                      //  console.log("error................");
                    //}
                      
                    
                   
                 //}
                 ,
                
                (payload,args,context)=>{
                    console.log("payargs",payload,args,context);
                    console.log("resultado ",
                        (payload.teamId==args.teamId &&
                        ((payload.senderId==context.user.id &&
                        payload.receiverId==args.userId) ||
                        (payload.senderId==args.userId &&
                        payload.receiverId==context.user.id))));
                    return (payload.teamId==args.teamId &&
                    ((payload.senderId==context.user.id &&
                    payload.receiverId==args.userId) ||
                    (payload.senderId==args.userId &&
                    payload.receiverId==context.user.id)));
                    
                }
            ),
        },
    },

    DirectMessage:{
        sender:async(parent,args,context)=>{
            console.log("parent",parent.sender);
            const user=await db.User.findOne({where:{id:parent.sender}});
            user.__typename="User";
            return user;
        }
    },

    Query:{
        
        directMessages:async(parent,args,context)=>{
            console.log("args",args,context);
            return await db.DirectMessage.findAll({order:[['createdAt','ASC']],
            where:{teamId:args.teamId,
                [db.Sequelize.Op.or]:[  
                    {[db.Sequelize.Op.and]:[
                        {receiver:args.receiverId},
                        {sender:context.user.id}],
                    },
                    {[db.Sequelize.Op.and]:[
                        {receiver:context.user.id},
                        {sender:args.receiverId}],
                    }

                ]
            }});
        }
    },
    Mutation:{
        
        createDirectMessage:async(parent,args,context)=>{
            try{
                console.log("args******************",args,context.user.id);
                const directMessage=await db.DirectMessage.create(
                    {text:args.text,teamId:args.teamId,receiver:args.receiverId,sender:context.user.id});
                
                console.log("..dm",directMessage.dataValues);
                pubsub.publish(NEW_DIRECT_MESSAGE,{
                    newDirectMessage:{
                        __typename:"DirectMessage",
                        id:directMessage.id,
                        text:directMessage.text,
                        sender:context.user.id,
                    
                        teamId:directMessage.teamId,
                        receiverId:directMessage.receiver,
                        createdAt:directMessage.createdAt
                    },
                    teamId:args.teamId,
                    senderId:context.user.id,
                    receiverId:args.receiverId
                });

                return true;

            }catch(err){
                return false;
            }
        }
    }
};