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
    VStack,
    Textarea,
  } from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import { useEffect, useState, useSyncExternalStore } from "react";

let client = null;
let connected = false;


function DataSelection({setLastMessage, channels}){
  const [subscription, setSubscription] = useState('');
  const [selected, setSelected] = useState('');

  function handleChange(e){

    if (subscription !== '' ) {
      setSelected(e.target.value);
      subscription.unsubscribe();
      client.unsubscribe();
      connected = false;
      setLastMessage([])
    }
    if(e.target.value === ""){
      connected = false;
      console.log("No Connection");
      subscription.unsubscribe();
      setLastMessage([])
    }
    
 
    setSubscription(client.subscribe(e.target.value, (msg) => {
      let msgJson = JSON.parse(msg.body);
      setLastMessage((curr) => limitData(curr, msgJson)); 
      connected = true;
      console.log("Subscribe to", e.target.value);
    }))
    
    
    
    
  }

  return(
    <Container p='0px'>  
      <Select placeholder='Select Sensor' onChange={handleChange} minW='501.41px'>
        {channels.map((item, index) => {
          return(
            <option value={item.link} key={index}>{item.name}</option>
          )
        })}
      </Select>
    </Container>
  )
}

function DataTable({lastMessage}){
  if (connected){
    let messageKeys = Object.keys(lastMessage[0])
  
    return (
      <Container 
        border='1px' 
        borderRadius='8' 
        borderColor='inherit'
      >
        <TableContainer>
          <Table variant = 'simple' type='inherit'>
            <Thead>
              <Tr>
                {messageKeys.map(item =>{
                  return(
                    <Th 
                      key={item} 
                      overflowX='hidden'
                      paddingLeft='0'
                    >{item}</Th>
                  )
                })}
              </Tr>
            </Thead>
            <Tbody>
              {lastMessage.map((item, index) =>{
                let allItems = Object.values(item)
                return(
                  <Tr key={index}>
                    {allItems.map(aItem =>{
                      return(
                        <Td 
                          key={aItem} 
                          //overflowX='hidden' 
                          maxW='140'
                          paddingLeft='0'
                        >{aItem}</Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    )
  }
}

function limitData(currentData, message) {
  if (currentData.length >= 4) {
    currentData.pop();
  }
  return [message,...currentData];
}

function connectToClient(){
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
      connected = false;
    }
  }, []);
}

function DataPreview({channels}){

  const [lastMessage, setLastMessage] = useState([]);

  connectToClient();

  return(
    <VStack align='flex-start'>
      <DataSelection setLastMessage={setLastMessage} channels={channels} />
      <DataTable lastMessage={lastMessage}/>
    </VStack>
  )
}

export default DataPreview;