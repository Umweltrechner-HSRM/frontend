import { 
  Box, 
  Select, 
  Stack, 
  StackDivider, 
  HStack, 
  VStack, 
  TableContainer, 
  Table, 
  Tr, 
  Th, 
  Thead, 
  Tbody, 
  Td, 
  Textarea, 
  Button
} from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { getBaseURL } from "../../helpers/api";
import keycloak from "../../keycloak";


const boxStyle = {
  backgroundColor: '#333',
  borderRadius: 20,
  color: '#eee',
  paddingRight: 20,
  paddingLeft: 20,
  paddingTop: 20,
  paddingBottom: 20,
  margin: 30,
  alignItems: 'center',
  width: 530,
  height: 350
}

const CHANNELS = [
  {name: 'Temperature', link: '/topic/sen1'},
  {name: 'Humidity', link: '/topic/sen2'},
  {name: 'Pressure', link: '/topic/sen3'},
]
let client = null

//Everything used in the Data Preview
//MAYBE TODO: Change this to a multi select that shows only latest value
//            of all the variables selected
function DataSelect({setLastMessage}){
  const [subscription, setSubscription] = useState('')
  const [channels, setChannels] = useState([])

  const queryClient = useQueryClient()

  const {} = useQuery({
    queryKey: ['variables'],
    queryFn: async () => {
      return await axios.get(`${getBaseURL()}/api/variable/getAllVariables`,{
        headers:{
          Authorization: `Bearer ${keycloak.token}`
        }
      })
    },
    enabled: false,
    onSuccess: (resp) =>{
      //TODO build Channels with {name: tmp, link: topic/tmp}
      let data = resp.data
      let result = []
      data.forEach(item => result.push({name: item.name, link:`/topic/${item.name}`}))
      setChannels(result)
    }

  }) 
  


  function handleChange(e){
    if (subscription !== '' ) {
      subscription.unsubscribe();
      setLastMessage([])
    }
    if(e.target.value === ""){
      subscription.unsubscribe();
      setLastMessage([])
    }
    
 
    setSubscription(client.subscribe(e.target.value, (msg) => {
      let msgJson = JSON.parse(msg.body);
      setLastMessage((curr) => limitData(curr, msgJson)); 
    }))
  }

  function handleClick(){
    queryClient.fetchQuery(['variables'])
  }
  return (
    <Select placeholder="Select Variable" onChange={handleChange} onClick={handleClick}>
      {channels.map((item,index) => {
        return(
          <option value={item.link} key={index}>{item.name}</option>
        )
      })}
    </Select>
  )
}
function DataTable({lastMessage}){
  let messageKeys = []
  if(lastMessage.length > 0){
    messageKeys = Object.keys(lastMessage[0])
  }
  
  return(
    <TableContainer
      width='100%'
    >
      <Table variant='simple' type='inherit'>
        <Thead>
          <Tr>
            {messageKeys.map((item,index) =>{
              return(
                <Th
                  key={index}
                  paddingLeft='0'
                >{item}</Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {lastMessage.map((item,index) => {
            let allItems = Object.values(item)
            return(
              <Tr key={index}>
                {allItems.map((aItem,aIndex) =>{
                 return(
                  <Td
                    key={aIndex}
                    paddingLeft='0'
                  >
                    {aItem}
                  </Td>
                 ) 
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
function DataPreviewComponent({setLastMessage, lastMessage}){
  return(
    <Box
      style={boxStyle}
    >
      <VStack>
        <DataSelect setLastMessage={setLastMessage}/>
        <DataTable lastMessage={lastMessage}/>
      </VStack>
    </Box>
  )
}


//Everything used to Input a Formula
function TextInput({setInput}){
  function handleChange(e){
    setInput(e.target.value)
  }

  return(
    <Textarea
      resize='none'
      placeholder="Input Formula"
      onChange={handleChange}
    />
  )
}
function Validation({input}){
  const queryClient = useQueryClient()
  const [validationText, setValidationText] = useState('Nothing Validated')

  const {} = useQuery({
    queryKey: ['validate'],
    queryFn: async () => {
      return await axios.post(`${getBaseURL()}/api/formula/validate`,
      {
        formula: input
      },
      {headers:{
        Authorization: `Bearer ${keycloak.token}`
      }}
    )},
    enabled: false,
    retry:false,
    onSuccess: () => {setValidationText('Valid')},
    onError: (resp) => {
      let message = resp.response.data
      message = message.split(/^(.*?): /gm).pop()
      setValidationText(message)
    }
  })

  const {} = useQuery({
    queryKey: ['add'],
    queryFn: async () => {
      return await axios.post(`${getBaseURL()}/api/formula/add`,
        {
          formula: input
        },
        {headers: {
          Authorization: `Bearer ${keycloak.token}`
        }},
      )},
      enabled: false,
      onSuccess: () => console.log('TODO: delete text in textarea')
  })


  function handleValidate(e){
    queryClient.fetchQuery(['validate'])
  }
  function handleAdd(){
    queryClient.fetchQuery(['add'])
    queryClient.fetchQuery(['formulas'])
  }

  return(
    <HStack
    width='100%'>
      <Box>{validationText}</Box>
      <Button onClick={handleValidate}>Validate</Button>
      <Button onClick={handleAdd}>Add</Button>
    </HStack>

  )
}
function FormString(){
  const [formulas, setFormulas] = useState()


  const {} = useQuery({
    queryKey: ['formulas'],
    queryFn: async () => {
      return await axios.get(`${getBaseURL()}/api/formula`,
        {headers: {
          Authorization: `Bearer ${keycloak.token}`
        }}
      )},
      onSuccess: (resp) => {
        let formulas = []
        resp.data.forEach(item => formulas.push(item.formula))
        let message = formulas.join('\n')
        setFormulas(message)
      }
  })


  return(
    <Textarea
    resize='none'
    readOnly
    height='170px'
    value={formulas}
    />
      
  )
}
function FormInputComponent(){
  const [input, setInput] = useState('')
  return(
    <Box
      style={boxStyle}
    >
      <VStack>
        <TextInput setInput={setInput} />
        <Validation input={input} />
        <FormString />
      </VStack>

    </Box>
  )
}

function connectToClient(){
  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
      }
    });
    client.activate();
    return() => {
      client.deactivate();
    }
  }, []);
}

function limitData(currentData, message) {
  if (currentData.length >= 4) {
    currentData.pop();
  }
  return [message,...currentData];
}

function FormulaInput(){
  const [lastMessage, setLastMessage] = useState([])

  //connect to WebSocket for receiving variable data
  connectToClient();

  return(
    <Box>
      <Stack
        align = 'flex-start'
        direction={{base: 'column', lg: 'row'}}
        dividers={<StackDivider borderColor='inherit' />}
      >
        <DataPreviewComponent 
          setLastMessage={setLastMessage} 
          lastMessage={lastMessage}
          
        />
        <FormInputComponent />
      </Stack>
    </Box>
  )
}

export default FormulaInput
