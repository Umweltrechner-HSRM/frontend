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
    Container,
    Button,
    ButtonGroup,
    Box,
  } from '@chakra-ui/react'
import { Client } from '@stomp/stompjs';

import { useEffect, useState } from "react";


let client = null;
let clientConnected = false;



function limitData(currentData, message) {
  if (currentData.length >= 4) {
    currentData.pop();
  }
  return [message,...currentData];
}


const DataPreview = () => {

  const [lastMessage, setLastMessage] = useState([]);
  const [displayValue, setDisplayValue] = useState("/topic/temperature");

  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
        console.log("DataPrev connected");
        client.subscribe(displayValue, (msg) => {
          let msgJson = JSON.parse(msg.body);
          setLastMessage((curr) => limitData(curr, msgJson));
        })
      }
    });
    return() => {
      console.log("Disconnected from DataPreview");
      clientConnected = false;
      client.deactivate();
    }
  }, []);

  


  return (
    <>
      <Container bg='lightgray' rounded= 'lg'>
        
        <TableContainer>
          <Table 
          variant='simple'
          colorScheme = 'darkgray'
          >
            <Thead>
              <Tr>
                <Th>Value</Th>
                <Th>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lastMessage.map(item => {
                return(
                  <Tr key = {item.timestamp}>
                    <Td>{item.value}</Td>
                    <Td>{item.timestamp}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
};

const ConnectButton = () => {
  function handleClick(){


    if (clientConnected){
      clientConnected = false;
      console.log('DataPrev disconnected')
      client.deactivate();
    }else{
      clientConnected = true;
      client.activate();
    }
  }

  return(
    <Button 
    colorScheme='blue' 
    onClick={() => handleClick()}
    >Hallo</Button>
  )

};

const Main = () => {
  



  return (
    <>
      <ConnectButton></ConnectButton>
      <DataPreview></DataPreview>

    </>
    
  );
}

export default Main;