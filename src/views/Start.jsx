import { Box, Container, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdCheckCircle } from "react-icons/all.js";
import { useState } from "react";


const Start = () => {

  const { data, isLoading, error } = useQuery(["temperature"], () =>
    fetch("http://localhost:8230/api/temperature").then((res) =>
      res.json()
    ),
    {
      refetchInterval: 5000,
    }
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Container maxW="container.md">
      <Box>
        <Text fontSize="4xl" fontWeight="bold">
          Temperature
        </Text>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            {JSON.stringify(data)}
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}

export default Start;