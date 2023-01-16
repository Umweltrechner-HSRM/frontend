import { Box, Button, Flex, HStack, IconButton, Select, Text } from '@chakra-ui/react';
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
    <>
      {!noMoreComps && (
          <HStack align={'right'}>
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
              ADD CHART
            </Button>
          </HStack>
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
    </>
  );
}

export default AddChart;
