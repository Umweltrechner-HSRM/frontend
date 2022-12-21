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
  if (!resp.ok) {
    // create error object and reject if not a 2xx response code
    let err = new Error("HTTP status code: " + resp.status)
    err.response = resp
    err.status = resp.status
    throw err
  }

  return await resp;
}

function ValidateButton({token,form,setReturnMessage}){
  const {isLoading, error, isSuccess, refetch} = useQuery({
    queryKey: ['validate'],
    queryFn: () => validate(token,form),
    enabled: false
  })

  let msg = 'Nothing Validated'
  if(isLoading){
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

const save = async (token,form) => {
  let resp = await fetch("http://localhost:8230/api/formula/add",{
    method: "POST",
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      
    },
    body:JSON.stringify(form)
  })
  return await resp
}

function SaveButton({token,form,setReturnMessage}){
  const {isFetching, error, isSuccess, refetch} = useQuery({
    queryKey: ['save'],
    queryFn: () => {save(token,form)},
    enabled: false
  })

  return(
    <Button onClick={refetch}>Add</Button>
  )
}

function ValidationButtons(){  
  const [message, setMessage] = useState()
  let tmpForm = {formula: 'x := temperature + pressure'}
  const {keycloak} = useKeycloak()
  
  return(
    <HStack>
      <Text>{message}</Text>
      <ValidateButton token={keycloak.token} form={tmpForm} setReturnMessage={setMessage} />
      <SaveButton token={keycloak.token} form={tmpForm} setReturnMessage={setMessage} />
    </HStack>
  )
}

export default ValidationButtons