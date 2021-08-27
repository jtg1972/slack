import db from '../models/index.mjs';
import formatErrors from '../formatErrors.mjs';

import { authorizeJorge ,authorizeUserOne,authorizeLogin} from '../permissions.mjs';




export default{
    
    Mutation:{
        createTeam:async(parent,args,context)=>{
            try{
                authorizeLogin(context);
        
                const team=await db.Team.create(args);
                await db.Channel.create({name:"general",teamId:team.id});
                await db.Member.create({teamId:team.id,userId:context.user.id,admin:true});
                return {
                    ok:true,
                    team
                };
            }
            catch(err){
                console.log("Err here",err.errors);
                return {
                    ok:false,
                    errors:formatErrors(err)
                };
            }
        },
        addTeamMember:async(parent,{email,teamId},context)=>{
            try{
                authorizeLogin(context);
                const member=await db.Member.findOne({where:{userId:context.user.id,teamId}},{raw:true});
                
                
                
                const userToAdd=await db.User.findOne({where:{email}},{raw:true});
                const memberAlready=await db.Member.findOne({where:{teamId,userId:userToAdd.id}})
                //const [member,userToAdd]=await Promise.all([memberPromise,userToAddPromise]);
                //console.log("tu",member,userToAdd);
                if( memberAlready){
                    return {
                        ok:false,
                        errors:[{path:"email",message:"This user is already in the team"}]
                    };
                }
                if (!member.admin){
                    return{
                        ok:false,
                        errors:[{path:"email",message:"Youre not authorized"}]
                    }
                }
                if(!userToAdd){
                    return{
                        ok:false,
                        errors:[{path:"email",message:"This email doesnt exist"}]
                    }
                }

                if(userToAdd){
                    await db.Member.create({userId:userToAdd.id,teamId});
                    return {
                        ok:true
                    }
                }
        
        
            }
            catch(err){
                return{
                    ok:false,
                    errors:formatErrors(err)
                }
            }
        }
    },
    Query:{
        getTeamMembers:async(parent,args,context)=>{
            const teams=await db.sequelize.query(
            'select * from public."Users" as u join public."Members" as m on m."userId"=u."id" where m."teamId"=?',{
                replacements:[args.teamId],
                model:db.User,
                raw:true});
            
            return teams;
         
        }
    },

    Team:{
        channels: async({id},args,{channelLoader})=>
            channelLoader.load(id)



            //return await db.Channel.findAll({where:{teamId:id,public:true}});
            /*return await db.sequelize.query(`select distinct on (c."id") *
                from public."Channels" as c left outer join 
                public."PCMembers" as pc on
                c."id"=pc."channelId"
                where (c."teamId"=:teamId and 
                (c.public=true or (pc."userId"=:userId)))`,
                {
                    replacements:{
                        teamId:id,
                        userId:context.user.id,

                    },
                    model:db.Channel,
                    raw:true
                });
        }*/,
        directMessageMembers:async(parent,args,context)=>{
            return await db.sequelize.query('select distinct on (u."id") u."id",u."username" from public."Users" as u join public."DirectMessages" as dm on ((u."id"=dm."sender") or (u."id"=dm."receiver")) where ((:currentUserId=dm."sender" or :currentUserId=dm."receiver") and dm."teamId"=:teamId)',
                {
                   replacements:{currentUserId:context.user.id,teamId:parent.id},
                   model:db.User,
                   raw:true 
                });
        }

    }
};