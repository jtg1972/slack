import React from 'react';
import styled from 'styled-components';

const ChatL = styled.div`
    grid-row:2;
    grid-column:3;
    background-color:white;
    text-align:left;
    padding:15px;
    display:flex;
    flex-direction:column-reverse;
    overflow-y:auto;
    //border-bottom:1px solid rgba(0,0,0,0.2);
`;

const Chat = ({children})=><ChatL>
{children}
</ChatL>

export default Chat;