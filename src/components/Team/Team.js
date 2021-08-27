import React,{useContext,useState} from 'react';
import styled from 'styled-components';
import TeamContext from '../../context/Team/context';
import {useQuery,gql} from '@apollo/client';
import {Link} from 'react-router-dom';


const TeamL = styled.div`
    grid-column:1;
    grid-row:1/4;
    background-color:#362234;
    border-right:1px solid rgba(0,0,0,0.2);
    color:#958993;
    text-align: center;
    overflow-y:auto;
  
`;

const TeamList=styled.ul`
    list-style:none;
    width:100%
    padding:0;
    padding-left:0px;
    margin:0;
    list-style:none;
    margin-top:10px;
    text-align:center;
    
    
    
`;

const TeamListItem=styled.li`
    height:50px;
    width:50px;
    background-color:#676066;
    color:#fff;
    margin:auto;
    margin-bottom:10px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:24px;
    border-radius:11px;
    &:hover{
        border-style:solid;
        border-width:thick;
        border-color:#767676;
    }
`;

const ALL_USERS=gql`
    query{
        allUsers{
            id
            email
            username
            
        }
    }
`;


//const displayTeam=(team,index)=><li key={index}>{team.name}</li>

const team=({id,letter})=><Link key={`team-${id}`} to={`/view-team/${id}`}><TeamListItem>{letter}</TeamListItem></Link>;

const Team = ({teams=[],toggleDialog,toggleAlert,}) => {
    /*const {teamState:{teams}} = useContext(TeamContext);

    const {loading,error,data}=useQuery(ALL_USERS);
    console.log("Errores ",error)
    if(loading)
        return <p>Loading...</p>;
    if(error)
        return <p>Error</p>;

    */

    return (
    <TeamL>
        <TeamList>
            {teams.map(team)}
            <Link key="add-team" to="/create-team">
                <TeamListItem>+</TeamListItem>
            </Link>
        </TeamList>
      </TeamL>);

        {/*<ul>{teams.map(displayTeam)}</ul>

        <button onClick={toggleAlert}>Alert</button>
        <button onClick={toggleDialog}>Dialog</button>
        {
            data.allUsers.map(({username, email, id})=>
                <p key={email}>{username} {email} {id}</p>
            )
        }*/}
    


}
export default Team;