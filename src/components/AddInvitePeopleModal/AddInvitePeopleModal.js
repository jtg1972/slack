import React,{useState} from 'react';
import {Button, Header, Modal, Input,Form,Message} from 'semantic-ui-react';
import {Formik} from 'formik';
import {gql,useMutation,useQuery} from '@apollo/client';
import ALL_TEAMS_QUERY from '../../graphql/meQuery';
import normalizeErrors from '../../normalizeErrors';

const ADD_MEMBER_TO_TEAM=gql`
    mutation($email:String!,    $teamId:Int!){
        addTeamMember(email:$email,teamId:$teamId){
            ok
            errors{
                path
                message
            }
    
        }
    } 
`;
const AddInvitePeopleModal=({open, onClose,teamId})=>{
    const [errsBE,setErrsBE]=useState([]);
    const [mutat1]=useMutation(ADD_MEMBER_TO_TEAM);
    const [errorList,setErrorList]=useState([]);
    const el=[];
    //const {data,client}=useQuery(ALL_TEAMS_QUERY);
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Add a new Member to the Team</Modal.Header>
            <Modal.Content>
                <Formik
                    initialValues={{email:""}}
                    validate={values=>{
                        let errors={};
                        if(!values.email){
                            errors.email="El email es requerido";
                        }
                        return errors;
                    }}
                    onSubmit={async(values,{setSubmitting,setErrors})=>{
                        console.log("ENtro aqui");
                        console.log("ti",teamId);
                        console.log("email",values.email);
                        const response=await mutat1({
                            variables:{
                                teamId:parseInt(teamId),
                                email:values.email
                            },
                            
                                    
                        
                        });
                        console.log("RE",response);
                        if(!response.data.addTeamMember.ok){
                            const ne=normalizeErrors(response.data.addTeamMember.errors);
                            console.log("ne",ne);
                            setErrors(ne);
                            /*let deee=response.data.addTeamMember.errors;
                            console.log("deee", deee);
                            setErrsBE(deee);
                            if(deee){
                                deee.forEach(err=>{
                                    el.push(err.message);
                                });
                                console.log("EL",el);
                                setErrorList(el);*/
                            }
                            else{
                                //setErrorList([]);
                                onClose();
                            } 
                            setSubmitting(false);
                        }
                        

                    }>
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting
                    })=>(
                        <div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <Input fluid placeholder="Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    name="email"/>
                                {errors.email && touched.email ? errors.email[0]:""}
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Button onClick={onClose} fluid disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" fluid disabled={isSubmitting} >Add Member</Button>
                            </Form.Group>
                            
                        </Form>
                        {/*<Message 
                            error
                            header="There were some errors with your submission"
                            list={errorList}
                        />*/}
                        
                        </div>    
                    )}
                </Formik>
            </Modal.Content>
        </Modal>
    );
}

export default AddInvitePeopleModal;