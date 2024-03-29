import {
  Button,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  Stack,
  Input,
  FormControl,
  FormLabel,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Chart from '../components/Chart.jsx';
import { Client } from '@stomp/stompjs';
import '../styles/styles.css';
import { DashboardTabsContext } from '../App.jsx';
import CreateDashboard from '../components/CreateDashboard.jsx';
import AddChart from '../components/AddChart.jsx';
import { useKeycloak } from '@react-keycloak/web';
import { getBaseURL, getWebSocketURL } from '../helpers/api.jsx';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { TbAlertTriangle } from 'react-icons/tb';

const ResponsiveGridLayout = WidthProvider(Responsive);

function convertData(json) {
  return { x: json.timestamp, y: +json.value.toFixed(2) };
}

const ChangeDashboardName = React.memo(({ isOpen, onClose, editDashboardName }) => {
    const [newName, setNewName] = useState('');

    function handleSubmit(e) {
      e.preventDefault();
      editDashboardName(newName);
      onClose();
    }

    useEffect(() => {
      if (!isOpen) {
        setNewName('');
      }
    }, [isOpen]);

    return (
      <>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay bg={'blackAlpha.700'} />
          <ModalContent>
            <ModalCloseButton />
            <>
              <ModalHeader
                textAlign={'center'}
                fontWeight={'bold'}
                fontSize={'1.7rem'}>
                Edit Dashboard name
              </ModalHeader>
              <form onSubmit={e => handleSubmit(e)}>
                <ModalBody pb={4}>
                  <FormControl>
                    <FormLabel>New Name</FormLabel>
                    <Input
                      autoFocus
                      borderColor={useColorModeValue('gray.400', 'gray.600')}
                      bg={useColorModeValue('white', 'gray.800')}
                      color={useColorModeValue('#4b4b4b', '#fff')}
                      maxLength={20}
                      onChange={e => setNewName(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter justifyContent={'center'}>
                  <Button
                    width={'100%'}
                    disabled={newName === ''}
                    type={'submit'}
                    colorScheme='blue'
                    mb={4}>
                    Apply
                  </Button>
                </ModalFooter>
              </form>
            </>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

const AreYouSure = React.memo(({ isOpen, onClose, deleteDashboard, dashboardName }) => {
  return (
    <>
      <Modal isCentered={true} marginTop={'4rem'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <TbAlertTriangle size={'40px'} color={'#ee5656'} />
              <Text>Delete Dashboard {dashboardName}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {
              deleteDashboard();
              onClose();
            }}>
              Yes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

let client = null;
localStorage.setItem('layout', '');

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(+localStorage.getItem('tabIndex') || 0);
  const [filteredDashboardComps, setFilteredDashboardComps] = useState(null);
  const queryClient = useQueryClient();
  const [data, setData] = useState({});
  const [editState, setEditState] = useState(false);
  const toast = useToast();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const stompSubs = useRef({});
  const TabProps = useContext(DashboardTabsContext);
  const [animation, setAnimation] = useState(true);
  const [dashboardSelected, setDashboardSelected] = useState(null);
  const { keycloak } = useKeycloak();
  const [layout, setLayout] = useState([]);
  const newLayout = useRef(null);
  const [breakpoint, setBreakpoint] = useState('lg');


  const { data: dashboards } = useQuery(['dashboards'],
    async () => {
      return await axios.get(`${getBaseURL()}/api/dashboard/`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
    }
  );

  const { mutate: addComponent, isLoading: addLoading } = useMutation(_addComponent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboards']).catch(console.log);
    },
    onError: (error) => {
      if (error.response.status === 424) {
        toast({
          title: 'Error adding chart',
          description: 'Chart already added to Dashboard',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    }
  });

  async function _addComponent(selectedComp) {
    const existingComps = filteredDashboardComps.components.map(comp => comp.id);
    return await axios.put(`${getBaseURL()}/api/dashboard/` + dashboards.data[tabIndex].id,
      {
        id: dashboards.data[tabIndex].id,
        name: dashboards.data[tabIndex].name,
        components: [...existingComps, selectedComp]
      }, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  const { mutate: changeLayout } = useMutation(_changeLayout, {
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['dashboards']).catch(console.log);
      setEditState(!editState);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  function compare(a, b) {
    if (a.position < b.position) {
      return -1;
    }
    if (a.position > b.position) {
      return 1;
    }
    return 0;
  }

  async function _changeLayout() {
    if (newLayout.current === null) {
      setEditState(!editState);
      return;
    }
    const changedLayout = newLayout?.current.map((comp) => {
      const pos = (comp.x % 3) + comp.y * 3;
      return { id: comp.i, position: pos };
    });
    return await axios.put(`${getBaseURL()}/api/dashboard/` + dashboards.data[tabIndex].id,
      {
        id: dashboards.data[tabIndex].id,
        name: dashboards.data[tabIndex].name,
        components: changedLayout.sort(compare).map((comp) => comp.id)
      }, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  const { mutate: deleteComponent, isLoading: deleteLoading } = useMutation(_deleteComponent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboards']).catch(console.log);
    }
  });

  async function _deleteComponent(id) {
    const newComps = filteredDashboardComps.components.filter(comp => comp.id !== id);
    return await axios.put(`${getBaseURL()}/api/dashboard/` + dashboards.data[tabIndex].id,
      {
        id: filteredDashboardComps.id,
        name: filteredDashboardComps.name,
        components: newComps.map(comp => comp.id)
      }, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
  }

  const { mutate: deleteDashboard } = useMutation(_deleteDashboard, {
    onSuccess: () => {
      setEditState(false);
      queryClient.invalidateQueries(['dashboards']).catch(console.log);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  async function _deleteDashboard() {
    const dashboardId = filteredDashboardComps.id;
    return await axios.delete(`${getBaseURL()}/api/dashboard/` + dashboardId,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
  }

  const { mutate: editDashboardName } = useMutation(_editDashboardName, {
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboards']).catch(console.log);
    }
  });

  async function _editDashboardName(newName) {
    return await axios.put(
      `${getBaseURL()}/api/dashboard/` + dashboards.data[tabIndex].id,
      {
        id: dashboards.data[tabIndex].id,
        name: newName,
        components: filteredDashboardComps.components.map(comp => comp.id)
      },
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }
    );
  }

  useEffect(() => {
    setLayout(null);
    setDashboardSelected(tabIndex < dashboards?.data.length);
    Object.keys(stompSubs.current).forEach(variable => {
      stompSubs.current[variable]?.unsubscribe();
      stompSubs.current[variable] = null;
    });
    TabProps.setTabData({ dashboards, setTabIndex, setEditState, editState });
    if (dashboards && tabIndex !== dashboards.data.length) {
      setFilteredDashboardComps(dashboards.data.filter(dashboard => dashboard.id === dashboards.data[tabIndex].id)[0]);
      setLayout(dashboards.data.filter(dashboard => dashboard.id === dashboards.data[tabIndex].id)[0].components.map((comp, index) => {
        return {
          i: comp.id,
          x: index % 3,
          y: Math.floor(index / 3),
          w: 1,
          h: 1
        };
      }));
    }
  }, [tabIndex, dashboards]);

  useEffect(() => {
    newLayout.current = null;
    TabProps.setTabData({ dashboards, setTabIndex, setEditState, editState });
  }, [editState]);


  useEffect(() => {
    if (filteredDashboardComps) {
      const dataCopy = {};
      filteredDashboardComps.components.forEach(comp => {
        dataCopy[comp.variable] = data[comp.variable];
      });
      setData(dataCopy);
      client = new Client({
        brokerURL: `${getWebSocketURL()}/api/looping`,
        onConnect: () => {
          filteredDashboardComps.components.forEach(comp => {
            if (!stompSubs.current[comp.variable]) {
              stompSubs.current[comp.variable] = client.subscribe('/topic/' + comp.variable, (msg) => {
                let msgJson = JSON.parse(msg.body);
                setData(prev => {
                  const tempData = { ...prev };
                  if (!prev[comp.variable]) {
                    tempData[comp.variable] = [convertData(msgJson)];
                  }
                  if (prev[comp.variable] && prev[comp.variable].at(-1).x !== convertData(msgJson).x) {
                    tempData[comp.variable] = [...prev[comp.variable], convertData(msgJson)];
                    if (tempData[comp.variable].length > 150) {
                      setAnimation(false);
                      tempData[comp.variable] = tempData[comp.variable].slice(-50);
                    }
                  }
                  return tempData;
                });
              });
            }
          });
        }
      });
      client.activate();
    }
    return () => {
      client?.deactivate();
    };
  }, [filteredDashboardComps, tabIndex, dashboards]);

  const handleLayoutChange = (layout) => {
    newLayout.current = layout;
  };

  const innerHeight = window.innerHeight;
  const bpToHeight = {
    lg: 0.44 * innerHeight,
    md: 0.47 * innerHeight,
    sm: 0.56 * innerHeight,
    xs: 0.49 * innerHeight,
    xxs: 0.65 * innerHeight
  };

  return (dashboards &&
    <>
      {dashboardSelected &&
        <Box mr={'0.5rem'} ml={'0.5rem'} boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
             borderWidth={'2px'}
             style={{ position: 'sticky', zIndex: '999', top: '0' }}
             borderColor={useColorModeValue('transparent', 'gray.700')}
             bg={editState && useColorModeValue('white', 'gray.800')} borderRadius={'5px'} padding={'0.2rem'}>
          <HStack spacing={4} justifyContent={'space-between'} alignItems={'center'}>
            {editState &&
              <>
                <Button colorScheme={'red'}
                        onClick={onOpenDelete}>DELETE DASHBOARD</Button>
                <Button marginLeft='0.5rem' colorScheme={'red'} onClick={onOpenEdit}>
                  EDIT NAME
                </Button>
              </>
            }
            {dashboardSelected && editState &&
              <AddChart addComponent={addComponent} filteredDashboardComps={filteredDashboardComps}
                        isLoading={addLoading} />
            }
            {keycloak.hasRealmRole('admin') &&
              <Box flex={2} align={'right'}>
                <Button colorScheme={editState ? 'teal' : 'blue'}
                        onClick={() => {
                          changeLayout();
                        }}>{editState ? 'EXIT EDIT MODE' : 'EDIT MODE'}</Button>
              </Box>
            }
          </HStack>
        </Box>
      }
      <div style={{ overflowX: 'hidden', scrollbarGutter: 'stable' }}>
        <ChangeDashboardName isOpen={isOpenEdit} onClose={onCloseEdit}
                             editDashboardName={editDashboardName}
        />
        <AreYouSure isOpen={isOpenDelete} onClose={onCloseDelete}
                    deleteDashboard={deleteDashboard} dashboardName={filteredDashboardComps?.name} />
        {!dashboardSelected && <CreateDashboard />}
        {
          layout &&
          <ResponsiveGridLayout style={{ position: 'relative', marginTop: '1rem' }}
                                layouts={{ lg: layout }}
                                breakpoints={{ lg: 1500, md: 1250, sm: 1050, xs: 800, xxs: 300 }}
                                cols={{ lg: 3, md: 3, sm: 2, xs: 2, xxs: 1 }}
                                onBreakpointChange={(bp) => setBreakpoint(bp)}
                                rowHeight={bpToHeight[breakpoint]}
                                width={800}
                                isDraggable={editState}
                                onLayoutChange={handleLayoutChange}
                                compactType={'horizontal'} verticalCompact={true}>
            {dashboardSelected &&
              filteredDashboardComps?.components.map((chart) => {
                return (
                  <Box key={chart.id} position={'relative'} className={editState ? 'grabbable' : null}>
                    <Chart setAnimation={setAnimation} animation={animation} userProps={{
                      name: chart.name, color: chart.variableColor,
                      type: chart.type, variable: chart.variable, stroke: chart.stroke
                    }}
                           data={data[chart.variable]} editState={editState}
                           id={chart.id} deleteComponent={deleteComponent} isLoading={deleteLoading} />
                  </Box>
                );
              })
            }
          </ResponsiveGridLayout>
        }
        {
          filteredDashboardComps?.components.length === 0 && dashboardSelected && !editState &&
          <Box mr={'0.6rem'} ml={'0.6rem'} bg={'blackAlpha.1000'} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flex gap={'0.3rem'} direction={'column'} mt={'2rem'} mb={'2.3rem'}>
              <Box mt={'0.2rem'} mb={'0.2rem'} borderRadius={'5px'} boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
                   style={{ padding: 20 }} bg={useColorModeValue('white', 'gray.800')}
                   borderWidth={'2px'} borderColor={useColorModeValue('white', 'gray.700')}>
                <Stack spacing={3}>
                  <Text fontWeight='bold' fontSize={'1.3rem'}>No charts added yet.</Text>
                  <Text fontWeight='bold' fontSize={'1.3rem'}>Activate EDIT Mode to add charts.</Text>
                </Stack>
              </Box>
            </Flex>
          </Box>
        }
      </div>
    </>
  );
};


export default Dashboard;