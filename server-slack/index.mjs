import db from './models/index.mjs';
import pkg from 'apollo-server-express';


import express, { application, request } from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import path from 'path';
import {fileLoader, mergeTypes, mergeResolvers} from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';
import {refreshTokens} from './auth.mjs';

const {ApolloServer/*, makeExecutableSchema/*,graphqlUploadExpress*/}=pkg;
import {makeExecutableSchema} from '@graphql-tools/schema';
import ChannelSchema from './schema/channel.mjs';
import MessageSchema from './schema/message.mjs';
import TeamSchema from './schema/team.mjs';
import UserSchema from './schema/user.mjs';
import ErrorSchema from './schema/error.mjs';
import DirectMessageSchema from './schema/directMessage.mjs';

import ChannelResolver from './resolvers/channel.mjs';
import MessageResolver from './resolvers/message.mjs';
import TeamResolver from './resolvers/team.mjs';
import UserResolver from './resolvers/user.mjs';
import DirectMessageResolver from './resolvers/directMessage.mjs';

//Subscriptions
import {createServer} from 'http';
import {execute,subscribe} from 'graphql';
import {PubSub} from 'graphql-subscriptions';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import { mkdir } from 'fs';
import DataLoader from 'dataloader';
import {channelBatcher} from './batchFunctions.mjs';
//FInaliza subscriptions imports
import pkg1 from 'formidable';
import graphqlUploadExpress from 'graphql-upload/public/graphQlUploadExpress.js';
const {MultipartParser} =pkg1;
const formidable=pkg1;

const types=[ChannelSchema,MessageSchema,TeamSchema,UserSchema,ErrorSchema,DirectMessageSchema];
const res=[ChannelResolver,MessageResolver,TeamResolver,UserResolver,DirectMessageResolver];

const typeDefs=mergeTypes(types,{all:true});
const resolvers=mergeResolvers(res,{all:true});

const schema=makeExecutableSchema({typeDefs,resolvers});

const SECRET="LHFASLD9IQW3R32FWKEFJWFEQW";
const SECRET2="FEWTQWER2341235FQWEFAWEFQW3";
console.log("db ",db.Team);
//console.log("graphqlexpress",graphQLExpress);
const app=express();

app.use(cors());
app.use(bodyParser.json());
//const uploadDir="files";
/*const fileMiddleware=(req,res,next)=>{
    if(!req.is('multipart/form-data')){
        return next();
    }
    
    console.log("****************multipart/formshould");
    const form=formidable.IncomingForm({
        uploadDir
    });
    console.log("form",form);
    form.parse(req,(error,{operations},files)=>{
        
        console.log("OPerations",operations);
        console.log("files",files);
        console.log("req",req);
        console.log("error",error);
        if(error){
            console.log("Error va",error);
        } 

        let document=JSON.parse(operations);
        
        if(Object.keys(files).length){
            const {file1}=files;

            const {type,path:filePath}=file1;
            console.log("typepath",type,filePath);
            document.variables.file1={
                type:type,
                path:filePath
            };

            //document={query:document.query,variables:document.variables};
        }
                /*document.operations={query:document.query,variables:document.variables};
            document.operations={query:`mutation ($channelId: Int!, $file: File) {
                createMessage(channelId: $channelId, file: $file)},
                variables: {
                    channelId: ${document.variables.channelId},
                    file: {
                        filetype: \"${document.variables.file.filetype}\",
                        path: \"${document.variables.file.path}\"
                    }
                }`
            };*/
  /*      //operations={operations:document}
        console.log("documENTTTT",document);
        //console.log("requestoperations",req.operations);
        //req.body={query:document.query,variables:document.variables};
        req.body=document;
        next(); 
    });
    
    
};*/



const addUser=async (req,res,next)=>{
    const token=req.headers['x-token'];
    console.log("token",token);
        try{
            const {user}=await jwt.verify(token,SECRET);
            console.log("user",user);
            req.user=user;
            console.log("req.user",req.user);
        }catch(err){
            console.log("entro reset header");
            const refreshToken=req.headers['x-refresh-token'];
            const newTokens=await refreshTokens(token,refreshToken,SECRET,SECRET2);
            console.log("new tokens",newTokens);
            if(newTokens.newToken && newTokens.refreshToken){
                console.log("entro reset headers");
                res.set('Access-Control-Expose-Headers','x-token,x-refresh-token');
                res.set('x-token',newTokens.newToken);
                res.set('x-refresh-token',newTokens.refreshToken);
            }
            req.user=newTokens.user;
        }
    
    next();
}
//app.use(bodyParser.json());
app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
app.use(addUser);
//app.use(fileMiddleware);
/*empieza insertar middleware
const logInput = async (resolve, root, args, context, info) => {
    console.log(`1. logInput: ${JSON.stringify(args) }`)
    const result = await resolve(root, args, context, info)
    console.log(`5. logInput`)
    return result
  }

  const logResult = async (resolve, root, args, context, info) => {
    console.log(`2. logResult`)
    const result = await resolve(root, args, context, info)
    console.log(`4. logResult: ${JSON.stringify(result)}`)
    return result
  }
  import {applyMiddleware} from 'graphql-middleware'


termina insertar middleware*/


//empieza anadido createserver github
const websocketServer = createServer((request, response) => {
    response.writeHead(404);
    response.end();
  });
  
  // Bind it to port and start listening
  websocketServer.listen(5000, () => console.log(
    `Websocket Server is now running on http://localhost:5000/graphql`
  ));
  console.log("schema",schema);
  const subscriptionServer = SubscriptionServer.create({
      schema,
      execute,
      subscribe,
      onConnect:async({token,refreshToken},webSocket)=>{
        console.log("entroooooo servidor connect");
        console.log("t rt",token,refreshToken);
        if(token && refreshToken){
            console.log("entr servidor token oojorgea");
            try{
                const {user}=jwt.verify(token,SECRET);
        
                console.log("user",user);
                return {user};
                //req.user=user;
                //console.log("req.user",req.user);
            }catch(err){
                console.log("entro reset header");
                
                const newTokens=await refreshTokens(token,refreshToken,SECRET,SECRET2);
                console.log("new tokens",newTokens);
                
                return {user:newTokens.user};
            }
            
        
            
        }
        return {};
    }
},
    {
      server: websocketServer,
      path: '/graphql',
    },
  );
//temina
/*empieza schema withmiddleware

const schemaWithMiddleware = applyMiddleware(schema, logInput, logResult)
termina schema withmiddleware*/

let server=new ApolloServer({
    schema, 
    playground:{endpoint:"http://localhost:3000/graphql"}, 
    subscriptions:{ 
        path:"ws://localhost:5000/graphql",
        
        
    },
    
    context:({req})=>{
        console.log(" contxt req.user",req.user);
        return{
            name:"jorge",
            user:req.user,
            SECRET,
            SECRET2,
            channelLoader:new DataLoader(ids=>channelBatcher(ids,req.user))
        };
    },
    //uploads: false///{
        /*maxFieldSize: 52428800, //bytes = 50MB
        maxFileSize: 52428800,
        maxFiles: 10*/
        
    //},
});
//console.log("Server",server);

//const httpServer=createServer(app);
//server.installSubscriptionHandlers(httpServer);
await server.start();
app.use('/files',express.static('files'));
server.applyMiddleware({app,
    route: {
        payload: {
           maxBytes: 52428800
        }
    }
});


    db.sequelize.sync({}).then(x=>{
    
        app.listen(3000,()=>{
            console.log("Port running 3000");
        });
    });


//Como estaba antes
/*db.sequelize.sync({}).then(x=>{
    
    app.listen(3000,()=>{
        console.log("Port running 3000");
    });
});*/
//final como estaba antes

//subscriptions anadido
/*const serverSubs=createServer(server);
db.sequelize.sync({}).then(x=>{
    
    serverSubs.listen(8081,()=>{
        console.log("Port running 3000");
        new SubscriptionServer({
            execute,
            subscribe,
            schema
        },{
            serverSubs,
            path:'/subscriptions'
        })
    });
});*/