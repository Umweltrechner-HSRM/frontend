import { 
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Select,
    Text,
    Flex,
    Spacer,
    Box,
    Button,
    Container,
    Input,
  } from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

let client = null;
let connected = false;

function DataSelection({setLastMessage, channels, setMessageKeys}){
  const [subscription, setSubscription] = useState('');

  function handleChange(e){
    if (subscription !== '' ) {
      subscription.unsubscribe();
    }
    if(e.target.value === ""){
      console.log("No Connection");
      setMessageKeys(['']);
      connected = false;
      subscription.unsubscribe();
    }
    setSubscription(client.subscribe(e.target.value, (msg) => {
      let msgJson = JSON.parse(msg.body);
      setMessageKeys(Object.keys(msgJson));
      setLastMessage((curr) => limitData(curr, msgJson)); 
      connected = true;
      
    }))
    console.log("Subscribe to", e.target.value);
    
    
  }

  return(
    <Container>  
      <Select placeholder='Select Dataset' onChange={handleChange}>
        {channels.map(item => {
          return(
            <option value={item.link} key={item.link}>{item.name}</option>
          )
        })}
      </Select>
    </Container>
  )
}

function DataTable({lastMessage, messageKeys}){
  if (connected){

  
    return (
      <Flex>
        <TableContainer>
          <Table variant = 'simple'>
            <Thead>
              <Tr>
                {messageKeys.map(item =>{
                  return(
                    <Th key={item}>{item}</Th>
                  )
                })}
              </Tr>
            </Thead>
            <Tbody>
              {lastMessage.map(item =>{
                let allItems = Object.values(item)
                return(
                  <Tr key={item.timestamp}>
                    {allItems.map(aItem =>{
                      return(
                        <Td key={aItem}>{aItem}</Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    )
  }
}

const CHANNELS = [
  {name: 'Temperature', link: '/topic/temperature'},
  {name: 'Humidity', link: '/topic/humidity'},
  {name: 'Pressure', link: '/topic/pressure'},
]


function FormInput(){
  return(
    <Input placeholder='Neue Formel'></Input>
  )
}





function limitData(currentData, message) {
  if (currentData.length >= 4) {
    currentData.pop();
  }
  return [message,...currentData];
}

function DataPreview(){

  const [lastMessage, setLastMessage] = useState([]);
  const [messageKeys, setMessageKeys] = useState(['']);

  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
        console.log("DataPrev connected");
      }
    });
    client.activate();
    return() => {
      console.log("Disconnected from DataPreview");
      client.deactivate();
    }
  }, []);




  return(
    <Flex>
      <DataSelection setLastMessage={setLastMessage} channels={CHANNELS} setMessageKeys={setMessageKeys}/>
      <FormInput />
      <DataTable lastMessage={lastMessage} messageKeys={messageKeys} />
    </Flex>
  )
}

export default DataPreview;