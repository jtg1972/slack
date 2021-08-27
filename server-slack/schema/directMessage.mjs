import {gql} from 'apollo-server-express';

export default gql`
    type Query{
        
        directMessages(teamId:Int!,receiverId:Int!):[DirectMessage!]

    }
    type Mutation{
       
        createDirectMessage(receiverId:Int!,text:String!,teamId:Int!):Boolean!
    }

    type Subscription{
        newDirectMessage(teamId:Int!,userId:Int!):DirectMessage!
    }

    type DirectMessage{
        id:Int!
        text:String!
        sender:User!
        receiverId:Int
        createdAt:String
    }
    
    
`;
