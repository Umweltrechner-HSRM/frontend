import { Box, Button, Flex, HStack, IconButton, Select, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import keycloak from '../keycloak.js';
import { getBaseURL } from '../helpers/api.jsx';
import { ThreeDots } from 'react-loader-spinner';

function AddChart({ addComponent, filteredDashboardComps, editState }) {
  const [components, setComponents] = useState(null);
  const [plusClicked, setPlusClicked] = useState(false);
  const selectedComp = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState(null);

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
      const filtered = components.map(comp => {
        if (
          !filteredDashboardComps.components.find(
            fComp => fComp.id === comp.id
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

  return (components ? (
    <>
      {!(filteredDashboardComps?.components.length === components?.length) && (
        <HStack align={'right'}>
          <Select borderWidth={'3px'} bg={useColorModeValue('white', 'gray.800')}
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
            ADD CHART
          </Button>
        </HStack>
      )}
      {filteredDashboardComps?.components.length === components?.length && (
        <Text pt={'2px'} fontWeight='bold' fontSize={'1.3rem'}>
          No more charts available
        </Text>
      )}
    </>
  ) : (
    <ThreeDots height='10px' width='10lx' radius='9' color={useColorModeValue('#1c88ff', '#2fe9ff')}
               ariaLabel='three-dots-loading' />
  ));
}

export default AddChart;
