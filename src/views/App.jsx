import { Box, Container, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/all.js";

const App = () => {

  const [listening, setListening] = useState(false);
  const [data, setData] = useState([]);
  let eventSource = undefined;

  useEffect(() => {
    if (!listening) {
      eventSource = new EventSource("http://localhost:8230/api/time");

      eventSource.onopen = (event) => {
        console.log("connection opened");
      };

      eventSource.onmessage = (event) => {
        console.log("result", event.data);
        setData(old => [...old, event.data]);
      };

      eventSource.onerror = (event) => {
        console.log(event.target.readyState);
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("eventsource closed (" + event.target.readyState + ")");
        }
        eventSource.close();
      };

      setListening(true);
    }

    return () => {
      eventSource.close();
      console.log("eventsource closed");
    };

  }, []);

  return (
    <Container maxW={'2xl'}>
      <List spacing={3}>
        {data.map(d =>
          <ListItem key={d}>
            <ListIcon as={MdCheckCircle} color='green.500' />
            {d}
          </ListItem>
        )}
      </List>


    </Container>
  );
};

export default App;