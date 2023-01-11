import { Box, Button, Flex, IconButton, Select, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import keycloak from '../keycloak.js';
import { getBaseURL } from '../helpers/api.jsx';

function AddChart({ addComponent, filteredDashboardComps, editState }) {
  const [components, setComponents] = useState(null);
  const [plusClicked, setPlusClicked] = useState(false);
  const selectedComp = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState(null);
  const [noMoreComps, setNoMoreComps] = useState(false);

  useQuery(
    ['components'],
    async () => {
      return await axios.get(`${getBaseURL()}/api/dashboard/components`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
    },
    {
      onSuccess: resp => {
        setComponents(resp.data);
      }
    }
  );

  useEffect(() => {
    if (components) {
      setNoMoreComps(
        filteredDashboardComps.components.length === components.length
      );
    }
  }, [filteredDashboardComps, editState, components]);

  useEffect(() => {
    if (components) {
      const filtered = components.map(comp => {
        if (
          !filteredDashboardComps.components.find(
            fComp => fComp.name === comp.name
          )
        ) {
          return comp;
        }
      });
      const firstIndex = filtered.findIndex(comp => comp);
      if (firstIndex === -1) {
        setFilteredOptions(null);
      } else {
        setFilteredOptions(filtered);
        selectedComp.current = filtered[firstIndex].id;
      }
    }
  }, [components, plusClicked, filteredDashboardComps]);

  return (
    <Box mr={'0.6rem'} ml={'0.6rem'} mt={'1rem'}
      borderRadius={'0.5rem'}
      bg={'#363636'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      borderWidth={'0.2rem'}
      borderColor={'#363636'}>
      {plusClicked && !noMoreComps && (
        <Flex gap={'0.3rem'} direction={'column'} mt={'2rem'} mb={'2.3rem'}>
          <Text color={'white'}>Select Chart</Text>
          <Select
            bg={'blue.700'}
            width={'20rem'}
            onChange={e => (selectedComp.current = e.target.value)}>
            {filteredOptions?.map(comp => {
              return (
                comp && (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} (Variable: {comp.variable})
                  </option>
                )
              );
            })}
          </Select>
          <Button
            marginTop={'0.5rem'}
            colorScheme={'blue'}
            onClick={() => {
              addComponent(selectedComp.current);
              setPlusClicked(false);
            }}>
            ADD
          </Button>
        </Flex>
      )}
      {!plusClicked && !noMoreComps && (
        <IconButton mt={'2rem'} mb={'2rem'}
          style={{ width: '8rem', height: '8rem' }}
          bg={'#696969'}
          icon={<HiOutlinePlusSm size={"70%"} />}
          color={'whitesmoke'}
          isRound={true}
          aria-label={'addChart'}
          _hover={{ bg: '#4880cc' }}
          onClick={() => setPlusClicked(true)}
        />
      )}
      {noMoreComps && (
        <Box
          style={{
            padding: 20,
            backgroundColor: '#575757',
            margin: 30,
            borderRadius: '0.5rem'
          }}>
          <Text fontWeight="bold" fontSize={'1.3rem'}>
            No more charts available
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default AddChart;
