import React from 'react';
import styled from 'styled-components';
import {Input,Icon} from 'semantic-ui-react';
import {Formik} from 'formik';
import FileUploada from '../FileUpload/FileUpload';
import {Button,Form} from 'semantic-ui-react';
const MessageL=styled.div`
    grid-columm:3;
    grid-row:3;
    background-color:white;
    margin:10px;
    display:grid;
    grid-template-columns:auto 1fr;
    
`;

/*const CREATE_MESSAGE_MUTATION=gql`
    mutation($channelId:Int!,$text:String!){
        createMessage(channelId:$channelId,text:$text)
    }
`;*/


const Message = ({placeholder,channelId,onSubmit1}) => {
    const ENTER_KEY=13;
    //const [mutat1]=useMutation(CREATE_MESSAGE_MUTATION);
    return (
        <MessageL>
            <FileUploada channelId={channelId}>
                <Button>{channelId}<Icon name="plus"></Icon></Button>  
            </FileUploada>

            
                
            
            <Formik
                    initialValues={{message:""}}
                    
                    onSubmit={async(values,{props,setSubmitting})=>{
                        console.log("aqui");
                        if(!values.message || !values.message.trim()){
                            setSubmitting(false);
                            return;
                        }
                        console.log("entroaquiii");
                        const response=await onSubmit1(values.message);
                        console.log("response",response);
                        /*const response=await mutat1({
                            variables:{
                                channelId:channelId,
                                text:values.message
                            }
                            
                        });
                        console.log("rs",response);*/
                        values.message="";
                        setSubmitting(false);
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting
                    })=>(
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                            
                                <Input fluid placeholder={`Message #${placeholder}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.message}
                                    name="message"
                                    onKeyUp={e=>{
                                        console.log("key", e.keyCode);
                                        if (e.keyCode==ENTER_KEY && !isSubmitting){
                                            handleSubmit();
                                        }else{
                                            console.log("no entro");
                                        }
                                    }}
                                    placeholder={`Message #${placeholder}`}/>
                                
                            </Form.Field>
                            
                        </Form>
                        
                    )}
                </Formik>
            
        </MessageL>
    );
}

export default Message;

