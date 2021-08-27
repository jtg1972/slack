import React,{useCallback,useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Icon,Button} from 'semantic-ui-react'; 
import {gql,useMutation} from '@apollo/client';

/*const CREATE_FILE_MESSAGE=gql`
  mutation($channelId:Int!,$file1:Upload!){
    createFileMessage(channelId:$channelId,file1:$file1){
      url
    }
  }
`;*/
const CREATE_FILE_MESSAGE=gql`
  mutation($channelId:Int!,$file1:Upload){
    createMessage(channelId:$channelId,file1:$file1)
  }
`;


const FileUpload = ({children,disableClick,channelId,
style}) => {
  const [file, setFile] = useState({});
  console.log("style",{...style});
  const [mutate]=useMutation(CREATE_FILE_MESSAGE/*,{
    onComplete:data=>console.log("on complete",data)
  }*/);
  
  const onDrop=useCallback(async(files)=>{
    console.log("file11111",files[0]);
    console.log("channelIdload",channelId);
    const response=await mutate({variables:{
      channelId,
      file1:files[0]
    },
    
  })
  },[channelId]);
  const {getRootProps,getInputProps,isDragActive}=
    useDropzone({
    onDrop,
   //style:{style},
    noClick:disableClick});
  return (

    <div style={{...style}} {...getRootProps()}>
      <input  {...getInputProps()}>
        
      </input>
      
      {children}
      
      
    </div>
  );

};


export default FileUpload;