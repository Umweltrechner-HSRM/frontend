import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Input,
  Select,
  Text, useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';
import keycloak from '../keycloak.js';
import { useState } from 'react';
import { getBaseURL } from '../helpers/api.jsx';

const colors = {
  Teal: '#00e7b0', Blue: '#00b0ff', Yellow: '#f5e13c', Purple: '#a500ff',
  Green: '#44ff55', Orange: '#ff8c00', Pink: '#ff55a3'
};

function CreateChart({ userProps, setUserProps }) {
  const [variables, setVariables] = useState(null);

  useQuery(
    ['variables'],
    async () => {
      return await axios.get(`${getBaseURL()}/api/variable/getAllVariables`, {
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

  return (
    <Box mt={'1rem'} mb={'1rem'}>
      <Flex gap={'0.3rem'} direction={'column'}>
        <>
          <Text>Name</Text>
          <Input
            color={useColorModeValue("#4b4b4b", "#fff")}
            borderWidth={'3px'} bg={useColorModeValue('white', 'gray.800')}
            value={userProps.name}
            maxLength={15}
            onChange={e => setUserProps({ ...userProps, name: e.target.value })}
          />
        </>
        <>
          <Text>Select Variable</Text>
          <Select
            borderWidth={'3px'} bg={useColorModeValue('white', 'gray.800')}
            placeholder={' '}
            value={userProps.variable}
            variant='outline'
            onChange={e => setUserProps({ ...userProps, variable: e.target.value })}>
            {variables?.map(vari => (
              <option key={vari.name} value={vari.name}>
                {vari.name}
              </option>
            ))}
          </Select>
        </>
        <>
          <Text>Select Type</Text>
          <Select
            borderWidth={'3px'} bg={useColorModeValue('white', 'gray.800')}
            placeholder={'Line'}
            value={userProps.type}
            variant='outline'
            onChange={e =>
              setUserProps({ ...userProps, type: e.target.value })
            }>
            <option value={'AREA_CHART'}>Area</option>
          </Select>
        </>
        <>
          <Text>Select Stroke</Text>
          <Select
            borderWidth={'3px'} bg={useColorModeValue('white', 'gray.800')}
            placeholder={'Smooth'}
            value={userProps.stroke.toLowerCase()}
            variant='outline'
            onChange={e =>
              setUserProps({ ...userProps, stroke: e.target.value })
            }>
            <option value={'straight'}>Straight</option>
          </Select>
        </>
        <>
          <Text>Select Color</Text>
          <Select
            borderWidth={'3px'} bg={useColorModeValue('white', 'gray.800')}
            value={userProps.variableColor}
            variant='outline'
            onChange={e =>
              setUserProps({ ...userProps, variableColor: e.target.value })
            }>
            {Object.keys(colors).map(color => (
              <option key={color} value={colors[color]}>
                {color}
              </option>
            ))}
          </Select>
        </>
      </Flex>
    </Box>
  );
}

export default CreateChart;
