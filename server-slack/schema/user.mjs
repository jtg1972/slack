import {gql} from 'apollo-server-express';

export default gql`
    type Query{
        me:User!
        allUsers:[User!]!
        getUser(userId:Int!):User
    }

    type Mutation{
        register(username:String!,email:String!,password:String!):RegisterResponse!
        login(email:String!, password:String!):LoginResponse!
    }

    type RegisterResponse{
        ok:Boolean!
        user:User
        errors:[Error!]

    }

    type LoginResponse{
        ok:Boolean!
        token:String
        refreshToken:String
        errors:[Error!]
    }


    type User{
        id:Int
        username:String
        email:String
        teams:[Team!]
    }

    
`;
