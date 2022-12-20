import { Button, Text, HStack} from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";

const validate = async (token,form) => {
  let resp = await fetch("http://localhost:8230/api/formula/validate", {
    method: "POST",
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form)
  });
  return await resp.json();
}

const save = async (token,form) => {
  let resp = await fetch("http://localhost:8230/api/formula/add",{
    method: "POST",
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body:JSON.stringify()
  })
  return await resp.json()
}

function ValidateButton({token,form,setReturnMessage}){
  const {isFetching, error, isSuccess, refetch} = useQuery({
    queryKey: ['validate'],
    queryFn: () => validate(token,form),
    enabled: false
  })

  let msg = 'Nothing Validated'
  if(isFetching){
    msg = 'Validating...'
  }
  if(error){
    msg = 'Invalid' 
  }
  if(isSuccess){
    msg = 'Valid'
  }

  useEffect(() =>{
    setReturnMessage(msg)
  })

  return(
    <Button onClick={refetch}>Validate</Button>
  )
}

function SaveButton({token,form,setReturnMessage}){
  const {isFetching, error, isSuccess, refetch} = useQuery({
    queryKey: ['validate'],
    queryFn: () => validate(token,form),
    enabled: false
  })

  let msg = 'Nothing Validated'
  if(isFetching){
    msg = 'Validating...'
  }
  if(error){
    msg = 'Invalid' 
  }
  if(isSuccess){
    msg = 'Valid'
  }

  useEffect(() =>{
    setReturnMessage(msg)
  })

  return(
    <Button onClick={refetch}>Validate & Add</Button>
  )
}

function ValidationButtons(){  
  const [message, setMessage] = useState()
  let tmpForm = {form: 'temp'}
  const {keycloak} = useKeycloak()
  let msg = 'Nothing Validated'
  
  return(
    <HStack>
      <Text>{message}</Text>
      <ValidateButton token={keycloak.token} form={tmpForm} setReturnMessage={setMessage} />
      <SaveButton token={keycloak.token} form={tmpForm} setReturnMessage={setMessage}/>
    </HStack>
  )
}

export default ValidationButtons