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
  } from '@chakra-ui/react'
import { Client } from '@stomp/stompjs';

import { useEffect, useState } from "react";


let client = null;

function limitData(currentData, message) {
  if (currentData.length > 4) {
    currentData.shift();
  }
  return [...currentData, message];
}


const DataPreview = () => {

  const [lastMessage, setLastMessage] = useState([]);

  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
        console.log("DataPrev connected");
        client.subscribe("/topic/temperature", (msg) => {
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


  return (
    <Container bg='gray' rounded= 'lg'>
      <TableContainer>
        <Table 
        variant='simple'
        colorScheme = 'twitter'
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
    )
};


export default DataPreview;