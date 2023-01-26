import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Input,
  Text, useColorModeValue, Select
} from '@chakra-ui/react';
import { Select as SearchSelect } from 'chakra-react-select';
import axios from 'axios';
import keycloak from '../keycloak.js';
import { useState } from 'react';
import { getBaseURL } from '../helpers/api.jsx';

const colors = {
  Teal: '#00e7b0', Purple: '#a500ff', Blue: '#00b0ff', Green: '#44ff55',
  Pink: '#ff55a3', Yellow: '#f5e13c', Orange: '#ff8c00',
};

function CreateChart({ userProps, setUserProps }) {
  const [variables, setVariables] = useState([]);

  const chakraStyles = {
    control: (provided, state) => ({
      ...provided,
      borderWidth: '2px',
      bg: useColorModeValue('white', 'gray.800'),
      borderColor: useColorModeValue('gray.400', 'gray.600')
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: useColorModeValue('#000000', '#fff')
    }),
    option: (provided, state) => ({
      ...provided,
      _hover: {  backgroundColor: useColorModeValue('gray.200', 'gray.400') },
      backgroundColor: 'transparent',
      color: useColorModeValue('#000000', '#fff')
    }),
    menuList: (provided, state) => ({
      ...provided,
      borderWidth: '2px',
      borderColor: useColorModeValue('gray.400', 'gray.600')
    }),
  };

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
            color={useColorModeValue('#000000', '#fff')}
            borderWidth={'2px'} bg={useColorModeValue('white', 'gray.800')}
            borderColor={useColorModeValue('gray.400', 'gray.600')}
            value={userProps.name}
            maxLength={15}
            onChange={e => setUserProps({ ...userProps, name: e.target.value })}
          />
        </>
        <>
          <Text>Select Variable</Text>
          <SearchSelect
            chakraStyles={chakraStyles}
            useBasicStyles={true}
            onChange={selected => setUserProps({ ...userProps, variable: selected.value })}
            placeholder={userProps?.variable || 'Select...'}
            options={variables?.map(vari => {
              return { label: vari.name, value: vari.name };
            })} />
        </>
        <>
          <Text>Select Type</Text>
          <SearchSelect
            chakraStyles={chakraStyles}
            useBasicStyles={true}
            isSearchable={false}
            placeholder={userProps?.type === 'AREA_CHART' ? 'Area' : 'Line'}
            onChange={selected => setUserProps({ ...userProps, type: selected.value })}
            options={[{value: 'LINE_CHART', label: 'Line'},{ value: 'AREA_CHART', label: 'Area' }]}/>
          </>
          <>
            <Text>Select Stroke</Text>
            <SearchSelect
              chakraStyles={chakraStyles}
              useBasicStyles={true}
              isSearchable={false}
              placeholder={userProps?.stroke === 'smooth' ? 'Smooth' : 'Straight'}
              onChange={selected => setUserProps({ ...userProps, stroke: selected.value })}
              options={[{value: 'SMOOTH', label: 'Smooth'},{ value: 'STRAIGHT', label: 'Straight' }]}/>
          </>
          <>
            <Text>Select Color</Text>
            <SearchSelect
              chakraStyles={chakraStyles}
              useBasicStyles={true}
              isSearchable={false}
              placeholder={Object.keys(colors).find(color => colors[color] === userProps?.variableColor)}
              onChange={selected => setUserProps({ ...userProps, variableColor: selected.value })}
              options={Object.keys(colors).map(color => {
                return { label: color, value: colors[color] };
              })}/>
          </>
      </Flex>
    </Box>
);
}

export default CreateChart;
