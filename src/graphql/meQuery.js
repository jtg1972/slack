import {gql} from '@apollo/client';

const ME_QUERY=gql`
    query{
        me{
            id
            username
            
            teams{
                
                
                id
                admin
                name
                directMessageMembers{
                    id
                    username
                }
                channels{
                    id
                    name
                    teamId
                    dm
                }
            
                
                
            } 
        }
    }
`;

export const DIRECT_MESSAGE_ME_QUERY=gql`
    query($userId:Int!){
        getUser(userId:$userId){
            id
            username
        }
    }
`;


export const GET_TEAM_MEMBERS_QUERY=gql`
query($teamId:Int!){
  getTeamMembers(teamId:$teamId){
    id
    username
  }
}
`;

export default ME_QUERY;
