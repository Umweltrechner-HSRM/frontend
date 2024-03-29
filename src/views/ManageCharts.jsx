import React, { useEffect, useMemo, useState } from 'react';
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
import { TbAlertTriangle } from 'react-icons/tb';
import {
  createColumnHelper
} from '@tanstack/react-table';
import { TableListView } from '../components/TableListView.jsx';
import { AddIcon } from '@chakra-ui/icons';
import { useKeycloak } from "@react-keycloak/web";
import { FiRefreshCcw } from "react-icons/fi";

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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <TbAlertTriangle size={'40px'} color={'#ee5656'}/>
            <Text>Delete Chart</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete "{chart?.name}"?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={() => {
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
});

const CreateNewModal = React.memo(({ isOpen, onClose, editChart }) => {
  const [userProps, setUserProps] = useState({
    name: '',
    type: '',
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
        type: userProps.type || 'LINE_CHART',
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

  useEffect(() => {
    if (!isOpen) {
      setUserProps({
        name: '',
        type: '',
        variable: '',
        variableColor: '#00e7b0',
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
        <ModalOverlay />
        <ModalContent maxW={'56rem'}>
          <ModalHeader fontWeight={'bold'} fontSize={'1.8rem'}
                       textAlign={'center'}>{editChart ? 'Edit Chart' : 'Create New Chart'}</ModalHeader>
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

/*
* @deprecated
*/
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
      return <BiSortUp size={'20px'} color={'rgba(255,255,255,0)'} />;
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
              const _createdAtString = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()} ${('0' + createdAt.getHours()).slice(-2)}:${('0' + createdAt.getMinutes()).slice(-2)}`;
              const updatedAt = new Date(Date.parse(chart.changedAt));
              const _updatedAtString = `${updatedAt.getDate()}/${updatedAt.getMonth() + 1}/${updatedAt.getFullYear()} ${('0' + updatedAt.getHours()).slice(-2)}:${('0' + updatedAt.getMinutes()).slice(-2)}`;
              return (
                <Tr key={index} style={{ borderBottomWidth: '4px', borderTopColor: 'gray' }}>
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
  const { keycloak } = useKeycloak();

  const columnHelper = createColumnHelper();
  const [selected, setSelected] = React.useState(null);


  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery(['components'],
    async () => {
      return await axios.get(`${getBaseURL()}/api/dashboard/components`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
    }
  );


  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('variable', {
      header: 'Variable',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor('createdBy', {
      header: 'Created By',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('changedAt', {
      header: 'Edited At',
      cell: info =>
        info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor('changedBy', {
      header: 'Edited By',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('action', {
      header: 'Actions',
      enableSorting: false,
      cell: ({ cell }) => (
        keycloak.hasRealmRole('admin') && (
          <Flex justifyContent={'center'} gap={2}>
            <Button onClick={() => {
              setSelected(cell.row.original);
              onOpen();
            }
            }><MdOutlineModeEditOutline /></Button>
            <Button onClick={() => {
              setSelected(cell.row.original);
              onOpenDel();
            }}><MdOutlineDeleteOutline /></Button>
          </Flex>
        )
      )
    })
  ], []);

  return (data &&
    <Box h={"100%"} overflowY={"auto"}>
      <Box p={3} pt={1} h={"100%"}>
        <Flex justifyContent={"flex-end"} maxH={"7%"} h={"7%"} pr={3} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
              borderWidth={1}
              borderRadius={"5px"}
              alignItems={"center"}>
          <Button size={{ base: "sm", md: "md" }}
                  disabled={isLoading || !data} onClick={refetch} mr={3}
                  isLoading={isLoading}
          >
            <FiRefreshCcw />
            <Text ml={2}>Refresh</Text>
          </Button>
          {keycloak.hasRealmRole('admin') &&
            <Button size={{base: "sm", md:"md"}} leftIcon={<AddIcon />} colorScheme='teal' variant='solid' onClick={() => {
              setSelected(null);
              onOpen();
            }}>
              Add
            </Button>}
        </Flex>
        <DeleteModal onClose={onCloseDel} isOpen={isOpenDel} chart={selected} />
        <CreateNewModal isOpen={isOpen} onClose={onClose}
                        editChart={selected} />
        <TableListView data={data.data} columns={columns}
                       refetch={refetch} updatedAt={dataUpdatedAt} loading={isLoading} />
      </Box>

    </Box>
  );
}

export default ManageCharts;
