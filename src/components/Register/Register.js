import React,{useState} from 'react';
import {Container,
    Header, 
    Input, 
    Button,
    Message,
    Form} from 'semantic-ui-react';
import {useMutation,gql} from '@apollo/client';

const REGISTER_MUTATION=gql`
    mutation($username:String!,$email:String!,$password:String!) {
        register(username:$username,email:$email,password:$password){
            ok
            errors{
                path
                message
            }
            user{
                id
                email
                username
            }
        }}
        `;

const Register=(props)=>{
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [errs,setErrs]=useState({});
    const [despErrors,setDespErrors]=useState([]);
    
    const [mutate,data]=useMutation(REGISTER_MUTATION);
    const onSubmit=async()=>{
        const response=await mutate({variables:{
            username,
            email,
            password
            }
        });
        setErrs({});
        setDespErrors([]);
        const {ok,errors}=response.data.register;
        let exerror={};
        let despEArray=[];
        if(ok){
            props.history.push("/login");
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
            <Header as="h2">Register</Header>
            <Form>
                <Form.Field error={errs.usernameError}>
                    <Input 
                        placeholder="Username" 
                        fluid 
                        value={username}
                        onChange={e=>setUsername(e.target.value)}/>
                </Form.Field>
                <Form.Field error={errs.emailError}>
                    <Input 
                        placeholder="Email" 
                        fluid 
                        value={email}
                        onChange={e=>setEmail(e.target.value)}/>
                </Form.Field>
                <Form.Field error={errs.passwordError}>
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        fluid 
                        value={password}
                        onChange={e=>setPassword(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <Button onClick={onSubmit}>Register</Button>
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

export default Register;