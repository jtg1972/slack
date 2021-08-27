import { formatApolloErrors } from 'apollo-server-core';
import db from '../models/index.mjs';
import formatErrors from '../formatErrors.mjs'
import userEvent from '@testing-library/user-event';
import { ModalDescription } from 'semantic-ui-react';

export default{

    Query:{
        hic:()=>"String",
    },
    Mutation:{
        createChannel:async(parent,args,context)=>{
            try{
                console.log("tid",args.teamId);
                const member=await db.Member.findOne({where:{userId:context.user.id, teamId:args.teamId,admin:true}});
                
                if(!member){
                    return{
                        ok:false,
                        errors:[{path:'name',message:"You can add channels to this team"}]
                    };
                }

                const response=await db.sequelize.transaction(async(transaction)=>{
                    const channel=await db.Channel.create({teamId:args.teamId,name:args.name,public:args.public},{transaction});
                    if(!args.public){
                        const members=args.members.filter(m=>m!=context.user.id);
                        members.push(context.user.id);
                        const arrFinal=members.map(m=>({userId:m,channelId:channel.id}));
                        console.log("arrFInal",arrFinal);
                        await db.PCMember.bulkCreate(arrFinal,{transaction});
                        
                    }
                    return channel;
                });
                return {
                    ok:true,
                    channel:response
                };

                
                
            }catch(err){
                return {
                    ok:false,
                    errors:formatErrors(err)
                };
            }
        },
        getOrCreateChannel:async(parent,args,context)=>{
            const member=await db.Member.findOne({
                where:{teamId:args.teamId,userId:context.user.id},
                raw:true
            });
            if(!member){
                throw new Error("Not authorized");
            }
            
            const allMembers=[...args.members,context.user.id];
            args.members.push(context.user.id);
            const [data,result]=await db.sequelize.query(
                `select c."id",c."name" from public."Channels" as c,
                public."PCMembers" as pc
                where pc."channelId"=c."id" and
                c."dm"=true and
                c."public"=false and 
                c."teamId"=${args.teamId}
                group by c."id"
                having array_agg(pc."userId") @> Array[${allMembers.join(",")}]
                and count(pc."userId")=${allMembers.length}`,
                {raw:true}
            
            );
            console.log("response",data,result);
            if(data.length){
                console.log("data0",data[0].id);
                return data[0];
            }else{
                const users=await db.User.findAll({raw:true,where:{id:{
                    [db.Sequelize.Op.in]:allMembers
                }}});
                const name=users.map(u=>u.username).join(", ");
                const channelId=await db.sequelize.transaction(async(transaction)=>{
                    const channel=await db.Channel.create({
                            teamId:args.teamId,
                            name,
                            public:false,
                            dm:true
                        },{transaction});
                    const cId=channel.id;
                    //const pcmembers=allMembers.filter(m=>m!=context.user.id);
                    //pcmembers.push(context.user.id);
                    const arrFinal=allMembers.map(
                        m=>({userId:m,channelId:cId}));
                    console.log("arrFInal",arrFinal);
                    await db.PCMember.bulkCreate(arrFinal,{transaction});
                    
                    console.log("cid",cId);
                    return cId;
                });
                return {
                    id:channelId,
                    name
                };
            }
        }
    }
};