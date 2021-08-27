import React from 'react';
import {Button, Header, Modal, Input,Form} from 'semantic-ui-react';
import {Formik} from 'formik';
import {gql,useMutation,useQuery} from '@apollo/client';
import ME_QUERY from '../../graphql/meQuery';
import _ from 'lodash';
import Downshift from 'downshift';
import {withRouter} from 'react-router-dom';
import {GET_TEAM_MEMBERS_QUERY} from '../../graphql/meQuery';
import MultiSelectUsers from '../MultiSelectUsers/MultiSelectUsers';
import { removeClientSetsFromDocument } from '@apollo/client/utilities';
/*const GET_TEAM_MEMBERS_QUERY=gql`
  query($teamId:Int!){
    getTeamMembers(teamId:$teamId){
      id
      username
    }
  }
`;*/
const GET_OR_CREATE_CHANNEL=gql`
  mutation($teamId:Int!,$members:[Int!]!){
    getOrCreateChannel(teamId:$teamId,members:$members){
      id
      name
    }
  }
`;


const DirectMessageModal=({open, onClose,teamId,currentUserId,history})=>{
    const {data,loading}=useQuery(GET_TEAM_MEMBERS_QUERY,{variables:{teamId},
      fetchPolicy:"network-only"});
    const [mutate]=useMutation(GET_OR_CREATE_CHANNEL);
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Add a new Direct Message User</Modal.Header>
            <Modal.Content>
                <Formik
                    initialValues={{members:[]}}
                    validate={values=>{
                        let errors={};
                        /*if(!values.name){
                            errors.name="El nombre es requerido";
                        }*/
                        return errors;
                    }}
                    onSubmit={async(values,{setSubmitting})=>{
                      console.log("valuesmembers",values.members);
                      let channelId=-1;
                      const response=await mutate({
                        variables:{
                          teamId,
                          members:values.members,
                          
                        },
                        update:(cache,{data:{getOrCreateChannel}})=>{
                          const {id,name}=getOrCreateChannel;
                          channelId=id;
                          const at=cache.readQuery({query:ME_QUERY});
                          console.log("at",at);
                          const idx=_.findIndex(at.me.teams,['id',parseInt(teamId)]);
                          console.log("params",at.me.teams,idx)
                          //at.allTeams.teams[idx].channels.push(createChannel);
                          const notInChannelList=at.me.teams[idx].
                            channels.every(
                              c=>c.id!=id
                            );
                          if(notInChannelList){
                            const primeros=at.me.teams.filter((team,index)=>{
                                return index<idx;
                            });
                            const x=at.me.teams[idx];
                            const ultimos=at.me.teams.filter((team,index)=>{
                                return index>idx;
                            });
                            //console.log("chtype",createChannel.channel);
                            /*const newData={...at,me:{...at.me,teams:[...primeros,
                                {...x,
                                    channels:[...x.channels,
                                            {...createChannel.channel}
                                            ]},
                                            ...ultimos]}};
                            console.log("newdata",newData);*/
                            cache.writeQuery({query:ME_QUERY,
                                data:{...at,me:{
                                    ...at.me,teams:[...primeros,
                                                    {...x,
                                                        channels:[...x.channels,
                                                            {...getOrCreateChannel,dm:true,public:false}
                                                    ]},
                                            ...ultimos]
                                    }
                                }
                            });
                          }
                        }
                      });
                      console.log("responseweb",response);
                      
                      onClose();
                      setSubmitting(false);
                      history.push(`/view-team/${teamId}/${channelId}`)
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
                        setFieldValue
                    })=>(
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                {/*<Input fluid placeholder="Channel name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    name="name"/>
                                <Example/>}
                                {/*{!loading && <Downshift onChange={selectedUser=>{
                                  history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                                  onClose();
                                }}>
                                {({getInputProps,
                                  getItemProps,
                                  isOpen,
                                  inputValue,
                                  selectedItem,
                                  highlightedIndex})=>(
                                    <div style={{border:'1px solid #ccc'}}>
                                      <input {...getInputProps({placeholder:"Select the user..."})} fluid/>
                                      {isOpen ? (
                                        <div style={{border:'1px solid #ccc'}}>

                                        {data.getTeamMembers
                                            .filter(i=>{return !inputValue || i.username.toLowerCase().includes(inputValue.toLowerCase());})
                                            .map((item,index)=>(
                                              <div {...getItemProps({item})}
                                                key={item.id}
                                                style={
                                                  {backgroundColor:highlightedIndex===index?
                                                    'gray':'white',
                                                    fontWeight:selectedItem===item.username?'bold':'normal'  
                                                  }
                                                }>
                                                {item.username}

                                              </div>
                                          ))} 

                                    </div>):null}
                                  
                                  </div>)}
                                </Downshift>
                                }</Modal.Content>
                                {errors.name && touched.name && errors.name}
                              </Form>*/}
                                <MultiSelectUsers
                                  value={values.members}
                                  handleChange={(e,{value})=>setFieldValue('members',value)}
                                  teamId={teamId}
                                  placeholder="Select Members to message"
                                  currentUserId={currentUserId}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Button onClick={e=>{
                                  onClose(e);
                                  resetForm();}} fluid disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" fluid disabled={isSubmitting} >Create</Button>
                            </Form.Group>
                        </Form>
                        
                    )}
                </Formik>
            </Modal.Content>
        </Modal>
    );
}

const BasicAutoComplete=({items,onChange})=>{
  return <Downshift onChange={onChange}>
  {({getInputProps,
    getItemProps,
    isOpen,
    inputValue,
    selectedItem,
    highlightedIndex})=>(
      <div style={{border:'1px solid #ccc'}}>
        <input {...getInputProps({placeholder:"Favorite color..."})}/>
        {isOpen ? (
          <div style={{border:'1px solid #ccc'}}>

          {items
              .filter(i=>{return !inputValue || i.toLowerCase().includes(inputValue.toLowerCase());})
              .map((item,index)=>(
                <div {...getItemProps({item})}
                  key={item}
                  style={
                    {backgroundColor:highlightedIndex===index?
                      'gray':'white',
                      fontWeight:selectedItem===item?'bold':'normal'  
                    }
                  }>
                  {item}

                </div>
            ))} {/*items*/}

      </div>):null}
      {/*isOpen*/}
    </div>)}
  </Downshift>
}

const Example=()=>{
  return (
    <BasicAutoComplete
      items={['apple','orange','carrot']}
      onChange={selectedItem=>console.log(selectedItem)}
    />
  );
}

export default withRouter(DirectMessageModal);