import React from 'react';
import {Header} from 'semantic-ui-react'
import styled from 'styled-components';
import Channel from '../Channel/Channel';

const HeaderL = styled.div`
    grid-columm:3;
    grid-row:1;
    background-color:white;
    //border-bottom:1px solid rgba(0,0,0,0.2);
`;

const Header1 = ({channelName}) => <HeaderL>
    <Header># {channelName}</Header>
</HeaderL>

export default Header1;