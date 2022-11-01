import { Box, Container, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/all.js";
import { Client } from "@stomp/stompjs";

let client = null;

const Start = () => {
  const [lastMessage, setLastMessage] = useState("No message received yet!");


  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () => {
        console.log("connected");
        client.subscribe("/topic/temperature", (msg) => {
          console.log(msg);
          setLastMessage(msg.body);
        });
      }
    });
    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <Container maxW="container.md">
      <Box>
        <Text fontSize="4xl" fontWeight="bold">
          Temperature
        </Text>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            Last Message: {lastMessage}
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};

export default Start;