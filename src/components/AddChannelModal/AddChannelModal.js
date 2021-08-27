import React from 'react';
import {Checkbox,Button, Header, Modal, Input,Form} from 'semantic-ui-react';
import {Formik} from 'formik';
import {gql,useMutation,useQuery} from '@apollo/client';
import ME_QUERY from '../../graphql/meQuery';
import _ from 'lodash';
import MultiSelectUsers from '../MultiSelectUsers/MultiSelectUsers';
import {withRouter} from 'react-router-dom';
const CREATE_CHANNEL_MUTATION=gql`
    mutation($teamId:Int!,$name:String!,$public:Boolean,$members:[Int!]){
        createChannel(teamId:$teamId,name:$name,public:$public,members:$members){
            ok
            channel{
                id
                name
                teamId
            }
            errors{
                path
                message
            }
        }
    }
`;
const AddChannelModal=({open, onClose,teamId,currentUserId,history})=>{

    const [mutat1]=useMutation(CREATE_CHANNEL_MUTATION);
    //const {data,client}=useQuery(ALL_TEAMS_QUERY);
    return (
        <Modal open={open} onClose={()=>{
            
            onClose();
        }}>
            <Modal.Header>Add a new Channel</Modal.Header>
            <Modal.Content>
                <Formik
                    initialValues={{name:"",public:true,members:[]}}
                    validate={values=>{
                        let errors={};
                        if(!values.name){
                            errors.name="El nombre es requerido";
                        }
                        return errors;
                    }}
                    onSubmit={async(values,{setSubmitting})=>{
                        console.log("ENtro aqui");
                        console.log("ti",teamId);
                        console.log("name",values.name);
                        
                        const response=await mutat1({
                            variables:{
                                teamId:parseInt(teamId),
                                name:values.name,
                                public:values.public,
                                members:values.members
                            },
                            optimisticResponse:{
                                createChannel:{
                                    __typename:"ChannelResponse",
                                    ok:true,
                                    channel:{
                                        __typename:"Channel",
                                        id:-1,
                                        name:values.name,
                                        teamId:teamId,
                                        dm:false
                                    }

                                }
                            },
            
                            update:(cache,{data:{createChannel}})=>{
                                const {ok,channel}=createChannel;
                                console.log("si");
                                console.log("cache",cache);
                                console.log("channelname",channel,ok);
                            
                                const at=cache.readQuery({query:ME_QUERY});
                                console.log("at",at);
                                const idx=_.findIndex(at.me.teams,['id',parseInt(teamId)]);
                                console.log("params",at.me.teams,idx)
                                //at.allTeams.teams[idx].channels.push(createChannel);
                                const primeros=at.me.teams.filter((team,index)=>{
                                    return index<idx;
                                });
                                const x=at.me.teams[idx];
                                const ultimos=at.me.teams.filter((team,index)=>{
                                    return index>idx;
                                });
                                console.log("chtype",createChannel.channel);
                                const newData={...at,me:{...at.me,teams:[...primeros,
                                    {...x,
                                        channels:[...x.channels,
                                                {...createChannel.channel}
                                                ]},
                                                ...ultimos]}};
                                console.log("newdata",newData);
                                cache.writeQuery({query:ME_QUERY,
                                    data:{...at,me:{
                                        ...at.me,teams:[...primeros,
                                                        {...x,
                                                            channels:[...x.channels,
                                                                {...createChannel.channel}
                                                        ]},
                                                ...ultimos]
                                        }
                                    }
                                });
                            }
                        });
                        console.log("rdc",response);
                        history.push(`/view-team/${teamId}/${response.data.createChannel.channel.id}`)
                        onClose();
                        
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        resetForm,
                        setFieldValue,

                    })=>(
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <Input fluid placeholder="Channel name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    name="name"/>
                                {errors.name && touched.name && errors.name}
                            </Form.Field>

                            <Form.Field>
                                <Checkbox toggle checked={!values.public} label="Private"
                                    onChange={(e,{checked})=>setFieldValue('public',!checked)}/>
                            </Form.Field>
                            {values.public?null:(<Form.Field>
                                <MultiSelectUsers value={values.members} 
                                handleChange={(e,{value})=>setFieldValue("members",value)}
                                teamId={teamId} 
                                currentUserId={currentUserId}
                                placeholder="Select Members to include in your private channel"/>
                            </Form.Field>)}
                            <Form.Group widths="equal">
                                <Button onClick={()=>{
                                    resetForm();     
                                    onClose();
                                }} fluid disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" onSubmit={()=>{
                                        handleSubmit();
                                        resetForm();
                                    }
                                }fluid disabled={isSubmitting} >Create channel</Button>
                            </Form.Group>
                        </Form>
                        
                    )}
                </Formik>
            </Modal.Content>
        </Modal>
    );
}

export default withRouter(AddChannelModal);