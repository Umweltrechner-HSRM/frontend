import React, { useEffect, useState } from 'react';
import {
  Box, Button,
  Flex,
  Heading, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td, Text,
  Tfoot,
  Th,
  Thead,
  Tr, useDisclosure, useToast
} from '@chakra-ui/react';
import ChartPreview from '../components/ChartPreview.jsx';
import '../styles/styles.css';
import CreateChart from '../components/CreateChart.jsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getBaseURL } from '../helpers/api.jsx';
import keycloak from '../keycloak.js';
import { MdOutlineModeEditOutline, MdOutlineDeleteOutline } from 'react-icons/md';
import { BiSortDown, BiSortUp } from 'react-icons/bi';

const CreateNewModal = React.memo(({ isOpen, onClose, editChart }) => {
  const [userProps, setUserProps] = useState({
    name: '',
    type: 'LINE_CHART',
    variable: '',
    variableColor: '',
    stroke: 'smooth'
  });
  const queryClient = useQueryClient();
  const toast = useToast();


  const { mutate: saveChart } = useMutation(postComponent, {
    onSuccess: resp => {
      toast({
        title: 'Success adding chart',
        description: `Added chart ${userProps.name}`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });
      queryClient.invalidateQueries(['components']).catch(console.log);
      onClose();
    }
  });

  async function postComponent() {
    return await axios.post(
      `${getBaseURL()}/api/dashboard/components`,
      {
        name: userProps.name,
        type: userProps.type,
        variable: userProps.variable,
        stroke: userProps.stroke.toUpperCase(),
        variableColor: userProps.variableColor || '#00e7b0'
      },
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  const { mutate: editComponent } = useMutation(_editComponent, {
    onSuccess: resp => {
      toast({
        title: 'Success editing chart',
        description: `Edited chart ${userProps.name}`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });
      queryClient.invalidateQueries(['components']).catch(console.log);
      onClose();
    }
  });

  async function _editComponent() {
    return await axios.put(
      `${getBaseURL()}/api/dashboard/components/${userProps.id}`,
      {
        id: userProps.id,
        name: userProps.name,
        type: userProps.type,
        variable: userProps.variable,
        stroke: userProps.stroke.toUpperCase() || 'SMOOTH',
        variableColor: userProps.variableColor || '#00e7b0'
      },
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  useEffect(() => {
    if (!isOpen) {
      setUserProps({
        name: '',
        type: 'LINE_CHART',
        variable: '',
        color: '',
        stroke: 'smooth'
      });
    } else {
      if (editChart) {
        setUserProps({
          name: editChart.name,
          type: editChart.type,
          variable: editChart.variable,
          variableColor: editChart.variableColor,
          id: editChart.id,
          stroke: editChart.stroke?.toLowerCase() || 'smooth'
        });
      }
    }
  }, [isOpen]);


  return (
    <>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg={'blackAlpha.700'} />
        <ModalOverlay />
        <ModalContent maxW={'56rem'}>
          <ModalHeader textAlign={'center'}>{editChart ? 'Edit Chart' : 'Create new chart'}</ModalHeader>
          <ModalCloseButton />
          <HStack justifyContent={'center'} gap={'5rem'} bg={'#282828'} ml={'1rem'} mr={'1rem'} borderRadius={'0.5rem'}>
            <CreateChart userProps={userProps} setUserProps={setUserProps} />
            <ChartPreview userProps={userProps} />
          </HStack>
          <ModalFooter>
            <Button onClick={() => editChart ? editComponent() : saveChart()}
                    isDisabled={!userProps.name || !userProps.variable} colorScheme='blue'>
              SAVE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});


function ChartTable({ currentCharts, onOpen, setEditChartId, deleteChart }) {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  let sortedCharts = [...currentCharts];

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (sortConfig) {
    sortedCharts.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  function getIcon(key) {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? <BiSortDown size={'20px'} /> : <BiSortUp size={'20px'} />;
    } else {
      return null;
    }
  }

  return (
    <Box borderRadius={'0.6rem'} bg={'#2c2c2c'} padding={'1rem'} textAlign={'center'} style={{margin: '1rem 1rem 0rem 1rem'}}>
      <Box bg={'#424242'} borderRadius={'0.5rem'} className={'tableFixHead'}>
        <Table variant='striped' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>
                <Button _active={{ color: '#ffffff' }} color={'white'} variant={'link'} rightIcon={getIcon('name')}
                        onClick={() => requestSort('name')}>Name</Button>
              </Th>
              <Th>
                <Button _active={{ color: '#ffffff' }} color={'white'} variant={'link'} rightIcon={getIcon('variable')}
                        onClick={() => requestSort('variable')}>Variable</Button>
              </Th>
              <Th>
                <Button _active={{ color: '#ffffff' }} color={'white'} variant={'link'} rightIcon={getIcon('createdAt')}
                        onClick={() => requestSort('createdAt')}>Created At</Button>
              </Th>
              <Th>
                <Button _active={{ color: '#ffffff' }} color={'white'} variant={'link'} rightIcon={getIcon('createdBy')}
                        onClick={() => requestSort('createdBy')}>Created By</Button>
              </Th>
              <Th>
                <Button _active={{ color: '#ffffff' }} color={'white'} variant={'link'} rightIcon={getIcon('changedAt')}
                        onClick={() => requestSort('changedAt')}>Edited At</Button>
              </Th>
              <Th>
                <Button _active={{ color: '#ffffff' }} color={'white'} variant={'link'} rightIcon={getIcon('changedBy')}
                        onClick={() => requestSort('changedBy')}>Edited By</Button>
              </Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedCharts.map((chart, index) => {
              const createdAt = new Date(Date.parse(chart.createdAt));
              const _createdAtString = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes()}`;
              const updatedAt = new Date(Date.parse(chart.changedAt));
              const _updatedAtString = `${updatedAt.getDate()}/${updatedAt.getMonth() + 1}/${updatedAt.getFullYear()} ${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
              return (
                <Tr key={index}>
                  <Td>
                    {chart.name}
                  </Td>
                  <Td>{chart.variable}</Td>
                  <Td>{_createdAtString}</Td>
                  <Td>{chart.createdBy}</Td>
                  <Td>{_updatedAtString}</Td>
                  <Td>{chart.changedBy}</Td>
                  <Td isNumeric>
                    <IconButton colorScheme='blue' isRound={true}
                                aria-label='edit' mr={'0.5rem'}
                                icon={<MdOutlineModeEditOutline />}
                                onClick={() => {
                                  setEditChartId(chart.id);
                                  onOpen();
                                }} />
                    <IconButton colorScheme='red' isRound={true}
                                aria-label='delete'
                                icon={<MdOutlineDeleteOutline />}
                                onClick={() => deleteChart(chart.id)} />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent={'center'}>
        <Button height={'3rem'} onClick={onOpen} mt={'1.5rem'} colorScheme={'blue'} width={'50%'}>Create Chart</Button>
      </Flex>
    </Box>
  );
}

function ManageCharts() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCharts, setCurrentCharts] = useState([]);
  const [editChartId, setEditChartId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  useQuery(['components'],
    async () => {
      return await axios.get(`${getBaseURL()}/api/dashboard/components`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
    }, {
      onSuccess: resp => {
        console.log('success');
        setCurrentCharts(resp.data);
      }
    }
  );

  const { mutate: deleteChart } = useMutation(_deleteChart, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Deleted chart`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      queryClient.invalidateQueries(['components']).catch(console.log);
    },
    onError: error => {
      if (error.response.status === 424) {
        toast({
          title: 'Error deleting chart',
          description: 'Cannot delete chart that is used in dashboard',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    }
  });

  async function _deleteChart(id) {
    return await axios.delete(
      `${getBaseURL()}/api/dashboard/components/` + id,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  useEffect(() => {
    if (!isOpen) setEditChartId(null);
  }, [isOpen]);

  return (currentCharts &&
    <>
      <CreateNewModal isOpen={isOpen} onClose={onClose}
                      editChart={currentCharts.find(chart => chart.id === editChartId)} />
      <ChartTable currentCharts={currentCharts} onOpen={onOpen} setEditChartId={setEditChartId}
                  deleteChart={deleteChart} />
    </>
  );
}

export default ManageCharts;
