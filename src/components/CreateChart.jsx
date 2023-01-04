import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import keycloak from '../keycloak.js';
import { useState } from 'react';
import { getBaseURL } from '../helpers/api.jsx';

const colors = {
  Teal: '#00e7b0',
  White: '#ffffff',
  Blue: '#0741ff',
  Yellow: '#f5e13c',
  Purple: '#6f65ff',
  Green: '#44ff55'
};

function CreateChart({ userProps, setUserProps }) {
  const [variables, setVariables] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  useQuery(
    ['variables'],
    async () => {
      return await axios.get(`${getBaseURL()}/api/sensor`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
    },
    {
      onSuccess: resp => {
        setVariables(resp.data);
      }
    }
  );

  const { mutate } = useMutation(postComponent, {
    onSuccess: resp => {
      toast({
        title: 'Success adding chart',
        description: `Added chart ${userProps.name}`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });
      setUserProps({ ...userProps, name: '' });
      queryClient.invalidateQueries(['components']).catch(console.log);
    }
  });

  async function postComponent() {
    return await axios.post(
      `${getBaseURL()}/api/sensor/api/dashboard/components`,
      {
        name: userProps.name,
        type: userProps.type,
        variable: userProps.variable,
        variableColor: userProps.color || '#00e7b0'
      },
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  return (
    <Box borderRadius={5} bg={'#363636'} padding={'1rem'}>
      <Text
        color={'white'}
        fontSize={'20'}
        fontWeight={'bold'}
        marginBottom={'20px'}>
        Create Chart
      </Text>
      <Flex gap={'0.3rem'} direction={'column'}>
        <>
          <Text color={'white'}>Name</Text>
          <Input
            color={'white'}
            bg={'#14181f'}
            value={userProps.name}
            maxLength={15}
            onChange={e => setUserProps({ ...userProps, name: e.target.value })}
          />
        </>
        <>
          <Text color={'white'}>Select Variable</Text>
          <Select
            placeholder={' '}
            color={'white'}
            bg={'#2D3748'}
            variant="outline"
            _hover={{ bg: '#3b485d' }}
            onChange={e =>
              setUserProps({ ...userProps, variable: e.target.value })
            }>
            {variables?.map(vari => (
              <option key={vari.name} value={vari.name}>
                {vari.name}
              </option>
            ))}
          </Select>
        </>
        <>
          <Text color={'white'}>Select Type</Text>
          <Select
            placeholder={'Line'}
            color={'white'}
            bg={'#2D3748'}
            variant="outline"
            _hover={{ bg: '#3b485d' }}
            onChange={e =>
              setUserProps({ ...userProps, type: e.target.value })
            }>
            <option value={'AREA_CHART'}>Area</option>
          </Select>
        </>
        <>
          <Text color={'white'}>Select Color</Text>
          <Select
            color={'white'}
            bg={'#2D3748'}
            variant="outline"
            _hover={{ bg: '#3b485d' }}
            onChange={e =>
              setUserProps({ ...userProps, color: e.target.value })
            }>
            {Object.keys(colors).map(color => (
              <option key={color} value={colors[color]}>
                {color}
              </option>
            ))}
          </Select>
        </>
      </Flex>
      <Button
        onClick={() => mutate()}
        isDisabled={!userProps.name || !userProps.variable}
        colorScheme={'blue'}
        marginTop={'20px'}>
        SAVE
      </Button>
    </Box>
  );
}

export default CreateChart;
