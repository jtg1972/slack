import db from './../models/index.mjs';
import {tryLogin} from '../auth.mjs';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import formatErrors from '../formatErrors.mjs';

export default{
    User:{
        teams:async(parent,args,context)=>{
            
            const teams=await db.sequelize.query('select * from public."Teams" as team join public."Members" as member on team.id=member."teamId" where member."userId"=?',{
                replacements:[context.user.id],
                model:db.Team,
                raw:true});
            
            return teams;
        
        }
        
    },

    Query:{
        me:async(parent,args,context)=>{
            const user = await db.User.findOne({where:{id:context.user.id}});
            return user;
        },
        getUser:async(parent,args)=>{
            console.log("Useridbusca",args.userId);
            return await db.User.findOne({where:{id:args.userId}});
        },
        allUsers:async(parent,args)=>{
            console.log("Entro server");
            const users=await db.User.findAll();
            return users;
        },
        
    },
    Mutation:{
        register:async(parent,args)=>{
            try{
                //const hashedPassword=await bcrypt.hash(password,12);
                //const user=await db.User.create({...otherArgs,password:hashedPassword});
                const user=await db.User.create(args);
                
                return {
                    ok:true,
                    user,
                };
            }
            catch(err){
                return {
                    ok:false,
                    errors:formatErrors(err)
                };
            }
        },
        login:(parent,{email,password},{SECRET,SECRET2})=>tryLogin(email,password,SECRET,SECRET2),
    }

};