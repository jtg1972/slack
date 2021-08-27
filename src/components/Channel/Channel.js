import React from 'react';
import styled from 'styled-components';
import {Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

const ChannelL=styled.div`
    grid-column:2;
    grid-row:1/4;
    background-color:#4e3a4c;
    border-right:1px solid rgba(0,0,0,0.2);
    color:#958993;
    text-align:left;
    overflow-y:auto;
`;

const TeamNameHeader=styled.h1`
    color:#fff;
    font-size:20px;
`;

const SideBarList=styled.ul`
    width:100%;
    list-style:none;
    padding-left:0;
`;

const paddingLeft='padding-left:10px';

const SideBarListItem=styled.li`
    padding:2px;
    list-style:none;
    ${paddingLeft};
    &:hover{
        background:#3e313c;
    }
`;

const SideBarListHeader=styled.li` 
    ${paddingLeft};
`;

const PushLeft=styled.div`
    ${paddingLeft};
`;

const Green=styled.span`
    color:#38978d;
`;

const Bubble=({on=false})=>(on?<Green>●</Green>:'○')



const channel=({id,name},teamId)=>(<Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}><SideBarListItem>{`# ${name}`}</SideBarListItem></Link>);
const dmChannel=({id,name},teamId)=>(<SideBarListItem key={`pchannel-${id}`}><Link to={`/view-team/${teamId}/${id}`}><Bubble/> {name}</Link></SideBarListItem>);

const Channel= ({teamName,userName,dmChannels=[],
    regularChannels=[],
    isOwner,users,
    onAddChannelClick,teamId,onInvitePeopleClick,
    onDirectMessageClick,currentUserId}) => {

    console.log("Userchannel",teamName,userName);
    return (
        <ChannelL>
            <PushLeft>
                <TeamNameHeader>
                    {teamName}
                </TeamNameHeader>
                {userName}
            </PushLeft>
            <div>
                <SideBarList>
                    <SideBarListHeader>Channels {isOwner?<Icon name="add circle" onClick={onAddChannelClick}/>:""}</SideBarListHeader>
                    {regularChannels.map(c=>channel(c,teamId))}
                </SideBarList>
            </div>
            <div>
                <SideBarList>
                    <SideBarListHeader>Direct Messages <Icon name="add circle" onClick={onDirectMessageClick}/></SideBarListHeader>
                    {dmChannels.map(dm=>dmChannel(dm,teamId))}
                </SideBarList>
            </div>
            {isOwner?<div>
                <a href="#invite-people" onClick={onInvitePeopleClick}>
                    + Invite People
                </a>
            </div>:""}
        </ChannelL>
    );
}

export default Channel;