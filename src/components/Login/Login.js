import React,{useState} from 'react';
import {Container,
    Header, 
    Input, 
    Button,
    Message,
    Form} from 'semantic-ui-react';
import {useMutation,gql} from '@apollo/client';

const LOGIN_MUTATION=gql`
    mutation($email:String!,$password:String!) {
        login(email:$email,password:$password){
            ok
            errors{
                path
                message
            }
            token
            refreshToken
        
        }
    }`;

const Login=(props)=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [errs,setErrs]=useState({});
    const [despErrors,setDespErrors]=useState([]);
    
    const [mutate]=useMutation(LOGIN_MUTATION);
    const onSubmit=async()=>{
        const response=await mutate({variables:{
            email,
            password
            }
        });
        setErrs({});
        setDespErrors([]);
        const {ok,errors,token,refreshToken}=response.data.login;
        let exerror={};
        let despEArray=[];
        if(ok){
            localStorage.setItem("token",token);
            localStorage.setItem("refreshToken",refreshToken);
            props.history.push("/view-team");
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
            <Header as="h2">Login</Header>
            <Form>
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
                    <Button onClick={onSubmit}>Login</Button>
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

export default Login;