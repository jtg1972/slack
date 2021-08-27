import db from './models/index.mjs';

export const channelBatcher=async(ids,user)=>{
  const results=await db.sequelize.query(`select distinct on (c."id") *
  from public."Channels" as c left outer join 
  public."PCMembers" as pc on
  c."id"=pc."channelId"
  where (c."teamId" in (:teamIds) and 
  (c.public=true or (pc."userId"=:userId)))`,
  {
      replacements:{
          teamIds:ids,
          userId:user.id,
  
      },
      model:db.Channel,
      raw:true
  });

  const data={};
  results.forEach(r=>{
    if(data[r.teamId]){
      data[r.teamId].push(r);
    }else{
      data[r.teamId]=[r];
    }
  });
  console.log("dataarr",data);
  return ids.map(id=>data[id])
}



