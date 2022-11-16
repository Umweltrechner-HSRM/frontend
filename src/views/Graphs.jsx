import { Box, Container, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Client } from "@stomp/stompjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

let client = null;

function limitData(currentData, message) {
  if (currentData.length > 200) {
    currentData.shift();
  }
  return [...currentData, message];
}


const Graph = () => {
  const [lastMessage, setLastMessage] = useState("No message received yet");
  const [data, setData] = useState([]);

  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () => {
        console.log("Graphs connected");
        client.subscribe("/topic/temperature", (msg) => {
          let msgJson = JSON.parse(msg.body);
          setLastMessage(msgJson);
          setData((curr) => limitData(curr, msgJson));
        });
      }
    });
    client.activate();
    return () => {
      console.log("Disconnected from Graphs");
      client.deactivate();
    };
  }, []);

  return (
    <Container maxW="4xl">
      <Box>
        <Text fontSize="4xl" fontWeight="bold">
          Temperature
        </Text>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            Last Message:
            Value: {lastMessage.value} Unit: {lastMessage.unit} Time: {lastMessage.timestamp}
          </ListItem>
        </List>
      </Box>

      <Box width={"800px"} height={"500px"}>
        <ResponsiveContainer width="100%">
          <LineChart
            width={800}
            height={500}
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0
            }}
          >
            <XAxis dataKey="timestamp" />
            <YAxis dataKey="value" domain={[-1, 1]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 100 }}
              strokeWidth="3"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
};

export default Graph;