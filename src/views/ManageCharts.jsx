import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Button,
  Flex,
  HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Table,
  Tbody,
  Td, Text,
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
import {TbAlertTriangle} from 'react-icons/tb';

const DeleteModal = React.memo(({ isOpen, onClose, chart }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteChart } = useMutation(_deleteChart, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Deleted chart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
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
          isClosable: true,
          position: 'bottom-right'
        });
      }
    }
  });

  async function _deleteChart() {
    return await axios.delete(
      `${getBaseURL()}/api/dashboard/components/` + chart.id,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg={'blackAlpha.800'} />
      <ModalContent bg={"#232323"}>
        <ModalHeader>
          <HStack>
            <TbAlertTriangle size={'30px'} color={"#ee5656"}/>
            <Text ml={2} color={'white'}>Delete chart</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete "{chart?.name}"?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={() => {
            deleteChart();
            onClose();
          }}>
            Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
})

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
        isClosable: true,
        position: 'bottom-right'
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
        isClosable: true,
        position: 'bottom-right'
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
        <ModalOverlay bg={'blackAlpha.800'} />
        <ModalContent maxW={'56rem'} bg={"#232323"}>
          <ModalHeader fontWeight={'bold'} fontSize={'1.8rem'}
                       textAlign={'center'}>{editChart ? 'Edit Chart' : 'Create new chart'}</ModalHeader>
          <ModalCloseButton />
          <HStack justifyContent={'center'} gap={'5rem'} ml={'1rem'} borderRadius={'0.5rem'}>
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

function ChartTable({ currentCharts, onOpen, setEditChartId, deleteChart, onOpenDel }) {
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
      if (a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  function getIcon(key) {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? <BiSortUp size={'20px'} /> : <BiSortDown size={'20px'} />;
    } else {
      return <BiSortUp size={'20px'} color={"rgba(255,255,255,0)"} />;
    }
  }

  return (
    <Box borderRadius={'0.6rem'} padding={'1rem'} textAlign={'center'} style={{ margin: '0.2rem 1rem 0rem 1rem' }}>
      <Flex justifyContent={'right'}>
        <Button height={'3rem'} onClick={() => {
          setEditChartId(null);
          onOpen();
        }} mb={'1.5rem'} colorScheme={'blue'} width={'10%'}>Create Chart</Button>
      </Flex>
      <Box bg={'#424242'} borderRadius={'0.5rem'} className={'tableFixHead'}>
        <Table variant='simple' colorScheme={'facebook'}>
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
              const _createdAtString = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()} ${('0'+createdAt.getHours()).slice(-2)}:${('0'+createdAt.getMinutes()).slice(-2)}`;
              const updatedAt = new Date(Date.parse(chart.changedAt));
              const _updatedAtString = `${updatedAt.getDate()}/${updatedAt.getMonth() + 1}/${updatedAt.getFullYear()} ${('0'+updatedAt.getHours()).slice(-2)}:${('0'+updatedAt.getMinutes()).slice(-2)}`;
              return (
                <Tr key={index} style={{ borderBottomWidth: '4px', borderTopColor: 'gray'}}>
                  <Td textAlign={'center'}>{chart.name}</Td>
                  <Td textAlign={'center'} bg={'#383838'}>{chart.variable}</Td>
                  <Td textAlign={'center'}>{_createdAtString}</Td>
                  <Td textAlign={'center'} bg={'#383838'}>{chart.createdBy}</Td>
                  <Td textAlign={'center'}>{_updatedAtString}</Td>
                  <Td textAlign={'center'} bg={'#383838'}>{chart.changedBy}</Td>
                  <Td textAlign={'center'} isNumeric>
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
                                onClick={() => {
                                  setEditChartId(chart.id);
                                  onOpenDel();
                                }} />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

function ManageCharts() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDel, onOpen: onOpenDel, onClose: onCloseDel } = useDisclosure();
  const [currentCharts, setCurrentCharts] = useState([]);
  const [editChartId, setEditChartId] = useState(null);

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
        setCurrentCharts(resp.data);
      }
    }
  );

  return (currentCharts &&
    <>
      <DeleteModal onClose={onCloseDel} isOpen={isOpenDel} chart={currentCharts.find(c => editChartId === c.id)} />
      <CreateNewModal isOpen={isOpen} onClose={onClose}
                      editChart={currentCharts.find(chart => chart.id === editChartId)} />
      <ChartTable currentCharts={currentCharts} onOpen={onOpen} setEditChartId={setEditChartId} onOpenDel={onOpenDel} />
    </>
  );
}

export default ManageCharts;
