import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import db from './models/index.mjs';
import { defaultDataIdFromObject } from '@apollo/client';
export const createTokens = async (user,secret1,secret2)=>{
    const createToken=jwt.sign({
            user:_.pick(user,['id','username'])
        },
        secret1,
        {
            expiresIn:'1h'
        }
    );
    const createRefreshToken=jwt.sign({
             user:_.pick(user,'id'),
        },
    secret2,
    {
        expiresIn:'7d'
    });
    return [createToken,createRefreshToken];
}

export const refreshTokens=async(token,refreshToken,SECRET,SECRET2)=>{
    let userId=-1;
    try{
        const {user:{id}}=jwt.decode(refreshToken);
        userId=id;
    }catch(err){
        return {

        };
    }
    if(!userId){
        return {

        };
    }
    const user=await db.User.findOne({where:{id:userId},raw:true});
    if(!user){
        return {

        };
    }
    const refreshSecret=user.password+SECRET2;
    try{
        jwt.verify(refreshToken,refreshSecret);
    }catch(err){
        return {

        };
    }
    const [newToken, newRefreshToken]=await createTokens(user,SECRET,refreshSecret);
    return {
        newToken,
        refreshToken:newRefreshToken,
        user
    }
}

export const tryLogin=async(email,password,SECRET,SECRET2)=>{
    const user=await db.User.findOne({where:{email},raw:true});
    if(!user){
        return {
            ok:false,
            errors:[{path:'email',message:"There is no user registered with this email"}]
        }   
        
    }
    const valid=await bcrypt.compare(password,user.password);
    if(!valid){
        return {
            ok:false,
            errors:[{path:'password',message:"Wrong password"}]
        }
    }
        
    const refreshTokenSecret=user.password+SECRET2;
    const [token,refreshToken]=await createTokens(user,SECRET,refreshTokenSecret);
    return {
        ok:true,
        token, 
        refreshToken
    }

}