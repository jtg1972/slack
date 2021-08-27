import {gql} from 'apollo-server-express';

export default gql`
    type Team{
        id:Int!
        name:String
        directMessageMembers:[User!]!
        channels:[Channel!]
        admin:Boolean
    }

    type CreateTeamResponse{
        ok:Boolean!
        team:Team
        errors:[Error!]
    }
    type AllTeamsResponse{
        ok:Boolean!
        errors:[Error!]
        teams:[Team!]
    }
    type VoidResponse{
        ok:Boolean!
        errors:[Error!]
    }
    type Query{
        getTeamMembers(teamId:Int!):[User!]
    }

    type Mutation{
        createTeam(name:String!):CreateTeamResponse!
        addTeamMember(email:String!,teamId:Int!):VoidResponse!
    }

       
`;
