import { Button, Text, HStack} from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { getBaseURL } from "../helpers/api";

const validate = async (token,form) => {
  let resp = axios.post(`${getBaseURL()}/api/formula/validate`,
    {
      formula: form
    },
    {headers: {
      Authorization: `Bearer ${token}`
    }}
  )

  return resp;
}

function ValidateButton({token,form,setReturnMessage}){
  let msg = 'Nothing Validated'
  const {isFetching, error, isSuccess, refetch, data} = useQuery({
    queryKey: ['validate'],
    queryFn: () => validate(token,form),
    enabled: false,
    retry: false,
    isFetching: () => {setReturnMessage('Validating...')},
    onError: (data) => {
      console.log("Error: ", data.response.data)
      let resp = data.response.data
      resp = resp.split(/^(.*?): /gm)
      resp = resp.pop()

      console.log(resp)
      setReturnMessage(resp)
      
    },
    onSuccess: () => {setReturnMessage('Valid')}
  })

  

  return(
    <Button onClick={refetch}>Validate</Button>
  )
}

const save = async (token,form) => {
  let resp = axios.post(`${getBaseURL()}/api/formula/add`,
    {
      formula: form
    },
    {headers: {
      Authorization: `Bearer ${token}`
    }}
  )
  
  return await resp
}

function SaveButton({token,form,setReturnMessage}){
  const queryClient = useQueryClient()
  const {isFetching, error, isSuccess, refetch} = useQuery({
    queryKey: ['save/validate'],
    queryFn: () => save(token,form),
    enabled: false,
    onSuccess: () => {
      queryClient.fetchQuery(["variables"])
    }
  })

  return(
    <Button onClick={refetch}>Add</Button>
  )
}

function ValidationButtons({form}){
  const [message, setMessage] = useState()
  let tmpForm = {formula: 'test2 := 6'}
  const {keycloak} = useKeycloak()
  
  return(
    <HStack>
      <Text>{message}</Text>
      <ValidateButton token={keycloak.token} form={form} setReturnMessage={setMessage} />
      <SaveButton token={keycloak.token} form={form} setReturnMessage={setMessage} />
    </HStack>
  )
}

export default ValidationButtons