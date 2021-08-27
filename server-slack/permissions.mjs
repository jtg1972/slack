import db from './models/index.mjs'

const requiresAuth=(context)=>{
    if(!context.user || !context.user.id)
        throw new Error("You are not authorized");
    
};

const requiresbe1=(context)=>{
    if(!context || context.user.id!=1)
        throw new Error("You re not one");
    
};

const requiresuser1emailcom=(context)=>{
    if(!context || context.name=="jorge"){
        throw new Error("Tu eres jorge");
    }
    
};

const requiresTeamMember=async(channelId,context)=>{
    console.log("Param requteam",channelId,context.user.id);
    const channel=await db.Channel.findOne({where:{id:channelId}});
    const member=await db.Member.findOne({where:{
        teamId:channel.teamId,
        userId:context.user.id
    }});
    console.log("member........................",member);
    if(!member){
        throw new Error("You have to be a member of the team to subscribe here");
    }
}

const authorizeLogin=(context)=>{
    requiresAuth(context);    
};

const authorizeUserOne=(context)=>{
    requiresAuth(context);
    requiresbe1(context);
};

const authorizeJorge=(context)=>{
    requiresAuth(context);
    requiresbe1(context);
    requiresuser1emailcom(context);
}

const authorizeTeamMember=(channelId,context)=>{
    requiresTeamMember(channelId,context);
}
export {authorizeLogin,authorizeUserOne,authorizeJorge,
authorizeTeamMember};
