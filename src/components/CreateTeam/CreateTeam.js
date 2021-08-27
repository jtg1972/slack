import React,{useState} from 'react';
import {Container,
    Header, 
    Input, 
    Button,
    Message,
    Form} from 'semantic-ui-react';
import {useMutation,gql} from '@apollo/client';

const CREATE_TEAM_MUTATION=gql`
    mutation($name:String!) {
        createTeam(name:$name){
            ok
            errors{
                path
                message
            }
            team{
                id
            }
        
        }
    }`;

const CreateTeam=(props)=>{
    const [name,setName]=useState("");
    const [errs,setErrs]=useState({});
    const [despErrors,setDespErrors]=useState([]);
    
    const [mutate]=useMutation(CREATE_TEAM_MUTATION);
    const onSubmit=async()=>{
    
        const response=await mutate({variables:{
                name
            }
        });
        setErrs({});
        setDespErrors([]);
        const {ok,errors,team}=response.data.createTeam;
        let exerror={};
        let despEArray=[];
        if(ok){
            props.history.push(`/view-team/${team.id}`);
        }else{            
            errors.forEach(({path,message})=>{
                let field=`${path}Error`;
                exerror={...exerror,[field]:message};
                despEArray.push(message);
            });
            setErrs(exerror);
            setDespErrors(despEArray);
        }
    }

    return(
        <Container text>
            <Header as="h2">Create a Team</Header>
            <Form>
                <Form.Field error={errs.nameError}>
                    <Input 
                        placeholder="Name of the team"
                        fluid 
                        value={name}
                        onChange={e=>setName(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <Button onClick={onSubmit}>Create team</Button>
                </Form.Field>
            </Form>
            {(Object.keys(errs).length>0) ? <Message 
                error
                header="There were some errors with your submission"
                list={despErrors}
            /> : ""}

        </Container>
    );
}

export default CreateTeam;