import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Routes from './components/Routes/Routes';
import reportWebVitals from './reportWebVitals';

import {ApolloClient, InMemoryCache} from '@apollo/client';
import {ApolloProvider} from '@apollo/client/react';
import {ApolloLink} from 'apollo-link';
import 'semantic-ui-css/semantic.min.css';

import {createHttpLink} from 'apollo-link-http';

//imports subscriptions comienzo
import {WebSocketLink} from '@apollo/client/link/ws';
import {split,HttpLink} from '@apollo/client';
import createFileLink from './httpLinkcopia';
import {getMainDefinition} from '@apollo/client/utilities';
import {createServer} from 'http';
import {createUploadLink} from 'apollo-upload-client';

//comienza subscr github
import {SubscriptionClient} from 'subscriptions-transport-ws';

/*const httpLink=new HttpLink({
  uri:"http://localhost:3000/graphql"

});*/
const httpLink=createUploadLink({
  uri:"http://localhost:3000/graphql"

});
/*const httpLink=createFileLink({
  uri:"http://localhost:3000/graphql"

});*/
/*let wsLink=new WebSocketLink({
  uri:"ws://localhost:3000/subscriptions",
  options:{reconnect:true,
  timeout:60000,
  lazy:true},
  

});*/
const wsClient = new SubscriptionClient(`ws://localhost:5000/graphql`, {
    reconnect: true,
    connectionParams:()=>({
      token:localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken')
      
    })
    
});



/*window.addEventListener('beforeunload', () => {
  // @ts-ignore - the function is private in typescript
  wsLink.subscriptionClient.close();
});*/
  
  const middlewareLink=new ApolloLink((operation,forward)=>{
    operation.setContext({
      headers:{
        "x-token":localStorage.getItem("token"),
        "x-refresh-token":localStorage.getItem("refreshToken"),
      }
    });
    return forward(operation)
  });
  
  const afterwareLink=new ApolloLink((operation,forward)=>{
    
    
    return forward(operation).map(response=>{
      console.log("entro afterwarelink");
      const {response:{headers}}=operation.getContext();
      //console.log("headers",operation.getContext()); 
      if(headers){
        const token=headers.get('x-token');
        const refreshToken=headers.get('x-refresh-token');
        if(token){
          console.log("token,client",token);
          localStorage.setItem('token',token);
        }
        if(refreshToken){
          console.log("tokenrefresh client",refreshToken);
          localStorage.setItem('refreshToken',refreshToken);
        }
      }
      return response;
    });
  });
  
  const httpLinkWithMiddleware=afterwareLink.concat(middlewareLink.concat(httpLink));

  // Extend the network interface with the WebSocket

  //console.log("agqlsub",addGraphQLSubscriptions);
/*const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  
  {httpLinkWithMiddleware,
  wsClient}
);*/

  
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind == 'OperationDefinition' &&
        definition.operation == 'subscription'
      );
    },
    wsClient,
   //httpLink
    httpLinkWithMiddleware
  );

  
const client=new ApolloClient({link:splitLink,
          cache:new InMemoryCache({})});


/*console.log("wslink",wsLink);          
wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () => 
    wsLink.subscriptionClient.maxConnectTimeGenerator.max;
  */      

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Routes/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
