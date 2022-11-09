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
  } from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";


let client = null;

function DataSelection({setLastMessage}){

  const [subscription, setSubscription] = useState('');

  function handleChange(e){
    if (subscription !== '' ) {
      subscription.unsubscribe();
    }
    setSubscription(client.subscribe(e.target.value, (msg) => {
      let msgJson = JSON.parse(msg.body);
      setLastMessage((curr) => limitData(curr, msgJson));
    }))
  }


  return(
    <>  
      <Select placeholder='Select Dataset' onChange={handleChange}>
        <option value="/topic/temperature">Dataset1</option>
        <option value="Daset2">Datset2</option>
      </Select>
    </>
  )
}

function DataTable({lastMessage}){
  return (
    <Box>
      <TableContainer>
        <Table variant = 'simple'>
          <Thead>
            <Tr>
              <Th>Value</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lastMessage.map(item =>{
              return(
                <Tr key={item.timestamp}>
                  <Td>{item.value}</Td>
                  <Td>{item.timestamp}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
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

  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
        console.log("DataPrev connected");
        client.subscribe('', (msg) => {
          let msgJson = JSON.parse(msg.body);
          setLastMessage((curr) => limitData(curr, msgJson));
        })
      }
    });
    client.activate();
    return() => {
      console.log("Disconnected from DataPreview");
      client.deactivate();
    }
  }, []);




  return(
    <>
      <DataSelection setLastMessage={setLastMessage}/>
      <DataTable lastMessage={lastMessage} />
    </>
  )
}

export default DataPreview;