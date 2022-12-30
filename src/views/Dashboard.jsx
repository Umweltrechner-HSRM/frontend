import {
    Box,
    Button,
    Heading,
    Text,
    Input,
    Select,
    VStack,
    Tabs,
    HStack,
    TabList,
    Tab,
    GridItem,
    Grid,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter, Center, Spinner
} from "@chakra-ui/react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import React, {useEffect, useRef, useState} from "react";
import Chart from "../components/Chart.jsx";
import {Client} from "@stomp/stompjs";
import "../Grid.css"

function CreateDashboard() {
    const queryClient = useQueryClient()
    const [dashboardName, setDashboardName] = useState('')

    const {mutate: addDashboard} = useMutation(postDashboard, {
        onSuccess: (resp) => {
            queryClient.invalidateQueries(['dashboards']).catch(console.log)
        }
    })

    async function postDashboard() {
        return await axios.post('http://localhost:8230/api/dashboard/', {
            name: dashboardName
        }, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
    }

    return (
        <Box borderRadius={5} bg={'#363636'} width={'40%'} padding={'1%'}>
            <Text color={'white'} fontSize={'24'}>Create Dashboard</Text>
            <VStack alignItems={'left'} gap={'2%'} marginTop={'4%'}>
                <Text color={'white'}>Name</Text>
                <Input color={'white'} bg={'black'}
                       onChange={e => setDashboardName(e.target.value)}/>
                <Button onClick={() => addDashboard()} isDisabled={!dashboardName}
                        colorScheme={'blue'}>ADD</Button>
            </VStack>
        </Box>
    )
}

function convertData(json) {
    return {x: json.timestamp, y: +json.value}
}

const AreYouSure = React.memo(({isOpen, onClose, deleteDashboard, dashboardName}) => {
    return (
        <>
            <Modal isCentered={true} marginTop={'4rem'} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Delete Dashboard {dashboardName}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text color={'white'}>Are you sure?</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {
                            deleteDashboard()
                            onClose()
                        }}>
                            Yes
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
})

let client = null

const Dashboard = () => {
    const [components, setComponents] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)
    const selectedComp = useRef(null)
    const [filteredDashboardComps, setFilteredDashboardComps] = useState(null)
    const queryClient = useQueryClient()
    const [data, setData] = useState({})
    const [editState, setEditState] = useState(false)
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const stompSubs = useRef([])

    useQuery(['components'],
        async () => {
            return await axios.get('http://localhost:8230/api/dashboard/components', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
        }, {
            onSuccess: (resp) => {
                setComponents(resp.data)
                selectedComp.current = resp.data[0]?.id
            }
        }
    )

    const {data: dashboards} = useQuery(['dashboards'],
        async () => {
            return await axios.get('http://localhost:8230/api/dashboard/', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
        }
    )

    const {mutate: addComponent} = useMutation(_addComponent, {
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboards']).catch(console.log)
        },
        onError: (error) => {
            if (error.response.status === 424) {
                toast({
                    title: 'Error adding chart',
                    description: "Chart already added to Dashboard",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        }
    })

    async function _addComponent() {
        const existingComps = filteredDashboardComps.components.map(comp => {
            return {id: comp.id, position: comp.position}
        })
        return await axios.put('http://localhost:8230/api/dashboard/' + dashboards.data[tabIndex].id,
            {
                id: dashboards.data[tabIndex].id,
                name: dashboards.data[tabIndex].name,
                components: [...existingComps,
                    {
                        id: selectedComp.current,
                        position: existingComps.length
                    }
                ]
            }, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            }
        )
    }

    const {mutate: deleteComponent} = useMutation(_deleteComponent, {
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboards']).catch(console.log)
        }
    })

    async function _deleteComponent(id) {
        const newComps = filteredDashboardComps.components.filter(comp => comp.id !== id)
        return await axios.put('http://localhost:8230/api/dashboard/' + dashboards.data[tabIndex].id,
            {
                id: filteredDashboardComps.id,
                name: filteredDashboardComps.name,
                components: newComps
            }, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
    }


    const {mutate: deleteDashboard} = useMutation(_deleteDashboard, {
        onSuccess: () => {
            setEditState(false)
            queryClient.invalidateQueries(['dashboards']).catch(console.log)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    async function _deleteDashboard() {
        const dashboardId = filteredDashboardComps.id
        return await axios.delete('http://localhost:8230/api/dashboard/' + dashboardId,
            {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
    }

    useEffect(() => {
        if (dashboards && tabIndex !== dashboards.data.length) {
            setFilteredDashboardComps(dashboards.data.filter(dashboard => dashboard.id === dashboards.data[tabIndex].id)[0])
        }
    }, [tabIndex, dashboards])


    useEffect(() => {
        if (filteredDashboardComps) {
            const dataCopy = {}
            filteredDashboardComps.components.forEach(comp => {
                dataCopy[comp.variable] = data[comp.variable]
            })
            setData(dataCopy)
            stompSubs.current.forEach(sub => sub.unsubscribe())
            stompSubs.current = []
            client = new Client({
                brokerURL: "ws://localhost:8230/api/looping",
                onConnect: () => {
                    filteredDashboardComps.components.forEach(comp => {
                        let sub = client.subscribe("/topic/" + comp.variable, (msg) => {
                            let msgJson = JSON.parse(msg.body);
                            setData(prev => {
                                const tempData = {...prev}
                                if (!prev[comp.variable]) {
                                    tempData[comp.variable] = [convertData(msgJson)]
                                } else {
                                    tempData[comp.variable] = [...prev[comp.variable], convertData(msgJson)]
                                    if (tempData[comp.variable].length > 300) {
                                        tempData[comp.variable] = tempData[comp.variable].slice(-10)
                                    }
                                }
                                return tempData
                            })
                        });
                        stompSubs.current.push(sub)
                    })
                }
            });
            client.activate();
        }
        return () => {
            client?.deactivate()
        };
    }, [filteredDashboardComps, tabIndex]);

    console.log(data)

    return (dashboards &&
        <Box>
            <AreYouSure isOpen={isOpen} onClose={onClose}
                        deleteDashboard={deleteDashboard} dashboardName={filteredDashboardComps?.name}/>
            <Heading>Dashboard</Heading>
            <Tabs marginTop={'1rem'} variant='soft-rounded'
                  style={{width: "min-content"}}
                  colorScheme='blue'
                  onChange={(index) => {
                      setTabIndex(index)
                      setEditState(false)
                  }}>
                <TabList gap={1} margin={'0.5rem'}>
                    {dashboards.data.map(dash => {
                        return <Tab borderRadius={'0.7rem'} bg={'#252525'} color='whitesmoke'
                                    borderWidth={'0.2rem'} key={dash.id}>{dash.name}</Tab>
                    })}
                    <Tab borderRadius={'0.7rem'} borderColor={'blue.300'} bg={'#252525'}
                         borderWidth={'0.2rem'} color='whitesmoke'>+</Tab>
                </TabList>
            </Tabs>
            {tabIndex === dashboards.data.length && <CreateDashboard/>}
            {tabIndex !== dashboards.data.length &&
                <>
                    <Text color={'white'}>Select Chart</Text>
                    <Select bg={'blue.700'} width={'20rem'} onChange={(e) => selectedComp.current = e.target.value}>
                        {components?.map(comp => {
                            return <option key={comp.id} value={comp.id}>{comp.name}</option>
                        })}
                    </Select>
                    <Button marginTop={'0.5rem'} colorScheme={'blue'} onClick={() => addComponent()}>ADD</Button>
                </>
            }
            {tabIndex !== dashboards.data.length &&
                <div style={{float: 'right', margin: '1rem 1rem 0rem 0rem'}}>
                    {editState &&
                        <Button marginRight='1rem' colorScheme={'red'} onClick={onOpen}>DELETE DASHBOARD</Button>}
                    <Button colorScheme={editState ? 'red' : 'blue'}
                            onClick={() => setEditState(!editState)}>EDIT</Button>
                </div>
            }
            <div className={'dashboardGrid'}>
                {tabIndex !== dashboards.data.length &&
                    filteredDashboardComps?.components.map(chart => {
                        return (
                            <Chart key={chart.id} userProps={{
                                name: chart.name,
                                color: chart.variableColor,
                                type: chart.type,
                                variable: chart.variable
                            }} data={data[chart.variable]} editState={editState} id={chart.id}
                                   deleteComponent={deleteComponent}/>
                        )
                    })
                }
            </div>
        </Box>
    );
};

export default Dashboard;