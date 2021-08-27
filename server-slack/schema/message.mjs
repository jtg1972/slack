import {gql} from 'apollo-server-express';
/*pagination offset
Query{
    messages(offset:Int,channelId:Int!):[Message!]
}*/
export default gql`
    scalar Upload
    type Query{
        him:String
        messages(channelId:Int!,cursor:String):[Message!]

    }
    type Mutation{
        himm:String
        createMessage(channelId:Int!,text:String,file1:Upload):Boolean!
        createFileMessage(channelId:Int!,file1:Upload!):File!
    }

    type Subscription{
        newChannelMessage(channelId:Int!):Message!
    }

    type Message{
        id:Int!
        text:String
        user:User!
        channel:Channel
        createdAt:String!
        url:String
        filetype:String
    }

    input File1{
        type:String
        path:String
    }

    type File{
        url:String!
    }

    
    
    
`;
