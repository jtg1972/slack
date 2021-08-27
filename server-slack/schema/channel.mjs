import {gql} from 'apollo-server-express';

export default gql`
    type Query{
        hic:String
    }
    type Mutation{
        createChannel(teamId:Int!,name:String!,public:Boolean=false,members:[Int!]):ChannelResponse!
        getOrCreateChannel(teamId:Int!,members:[Int!]!):DMChannelResponse
    }
    type ChannelResponse{
        ok:Boolean!
        channel:Channel
        errors:[Error!]
    }
    type Channel{
        id:Int!
        name:String!
        public:Boolean
        messages:[Message!]
        users:[User!]
        teamId:Int
        dm:Boolean!
    }

    type DMChannelResponse{
        id:Int
        name:String
    }
    
    
`;
