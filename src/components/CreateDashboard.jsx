import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import keycloak from '../keycloak.js';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text, useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { useState, memo } from 'react';
import { getBaseURL } from '../helpers/api.jsx';

const CreateDashboard = memo(() => {
  const queryClient = useQueryClient();
  const [dashboardName, setDashboardName] = useState('');

  const { mutate: addDashboard } = useMutation(postDashboard, {
    onSuccess: resp => {
      queryClient.invalidateQueries(['dashboards']).catch(console.log);
    }
  });

  async function postDashboard() {
    return await axios.post(
      `${getBaseURL()}/api/dashboard/`,
      {
        name: dashboardName
      },
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  return (
    <Box
      borderRadius={"5px"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} bg={useColorModeValue("white", "gray.800")}
      borderWidth={"2px"} borderColor={useColorModeValue("white", "gray.700")}
      width={'50%'} padding={'1%'} margin={'2rem'}>
      <Text fontWeight={'bold'} color={useColorModeValue("#4b4b4b", "#fff")} fontSize={'24'}>
        Create Dashboard
      </Text>
      <VStack alignItems={'left'} gap={'2%'} marginTop={'4%'}>
        <form
          onSubmit={e => {
            e.preventDefault();
            addDashboard();
          }}>
          <FormLabel color={useColorModeValue("#4b4b4b", "#fff")}>Name</FormLabel>
          <Input
            color={useColorModeValue("#4b4b4b", "#fff")}
            borderColor={useColorModeValue('gray.400', 'gray.600')}
            borderWidth={'2px'} bg={useColorModeValue('white', 'gray.800')}
            maxLength={20}
            onChange={e => setDashboardName(e.target.value)}
          />
        </form>
        <Button
          onClick={() => addDashboard()}
          isDisabled={!dashboardName}
          colorScheme={'blue'}>
          ADD
        </Button>
      </VStack>
    </Box>
  );
})

export default CreateDashboard;
