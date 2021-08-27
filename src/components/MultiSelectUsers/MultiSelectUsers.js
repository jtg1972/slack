import React from 'react';
import {Dropdown} from 'semantic-ui-react';
import {useQuery} from "@apollo/client";
import {GET_TEAM_MEMBERS_QUERY} from '../../graphql/meQuery';

const MultiSelectUsers=({teamId,value,handleChange,
  currentUserId,placeholder})=>{
  const {data,loading}=useQuery(GET_TEAM_MEMBERS_QUERY,
    {variables:{teamId},
    fetchPolicy:"network-only"});
  return loading?null:(
    <Dropdown 
      value={value} 
      placeholder={placeholder} 
      fluid
      onChange={handleChange}
      multiple
      search
      selection
      options={data.getTeamMembers.filter(tm=>tm.id!=parseInt(currentUserId)).map(tm=>({key:tm.id,value:tm.id,text:tm.username}))}
      />
  );

}

export default MultiSelectUsers;