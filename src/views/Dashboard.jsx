import {
    Button,
    Heading,
    Text,
    Select,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter, Flex, Box, Center, VStack, Spacer,
} from "@chakra-ui/react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import React, {useContext, useEffect, useRef, useState} from "react";
import Chart from "../components/Chart.jsx";
import {Client} from "@stomp/stompjs";
import "../Grid.css"
import {DashboardTabsContext} from "../App.jsx";
import CreateDashboard from "../components/CreateDashboard.jsx";
import AddChart from "../components/AddChart.jsx";

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
    const [tabIndex, setTabIndex] = useState(0)
    const [filteredDashboardComps, setFilteredDashboardComps] = useState(null)
    const queryClient = useQueryClient()
    const [data, setData] = useState({})
    const [editState, setEditState] = useState(false)
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const stompSubs = useRef({})
    const TabProps = useContext(DashboardTabsContext)


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

    async function _addComponent(selectedComp) {
        const existingComps = filteredDashboardComps.components.map(comp => {
            return {id: comp.id, position: comp.position}
        })
        return await axios.put('http://localhost:8230/api/dashboard/' + dashboards.data[tabIndex].id,
            {
                id: dashboards.data[tabIndex].id,
                name: dashboards.data[tabIndex].name,
                components: [...existingComps,
                    {
                        id: selectedComp,
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
        Object.keys(stompSubs.current).forEach(variable => {
            stompSubs.current[variable]?.unsubscribe()
            stompSubs.current[variable] = null
        })
        TabProps.setTabData({dashboards, setTabIndex, setEditState})
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
            client = new Client({
                brokerURL: "ws://localhost:8230/api/looping",
                onConnect: () => {
                    filteredDashboardComps.components.forEach(comp => {
                        if (!stompSubs.current[comp.variable]) {
                            stompSubs.current[comp.variable] = client.subscribe("/topic/" + comp.variable, (msg) => {
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
                        }
                    })
                }
            });
            client.activate();
        }
        return () => {
            client?.deactivate()
        };
    }, [filteredDashboardComps, tabIndex, dashboards]);

    // console.log('data',data)
    // console.log('subs',stompSubs.current)
    const dashboardSelected = (tabIndex !== dashboards?.data.length)

    return (dashboards &&
        <>
            <AreYouSure isOpen={isOpen} onClose={onClose}
                        deleteDashboard={deleteDashboard} dashboardName={filteredDashboardComps?.name}/>
            {!dashboardSelected && <CreateDashboard/>}
            {dashboardSelected &&
                <Flex marginRight={'2rem'}>
                    {editState &&
                        <Button marginLeft='1rem' colorScheme={'red'}
                            onClick={onOpen}>DELETE DASHBOARD</Button>
                    }
                    <Spacer/>
                    <Button colorScheme={editState ? 'red' : 'blue'}
                        onClick={() => setEditState(!editState)}>{editState ? 'CANCEL' : 'EDIT MODE'}</Button>
                </Flex>
            }
            <div className={'dashboardGrid'}>
                {dashboardSelected &&
                    filteredDashboardComps?.components.map(chart => {
                        return (
                            <Chart key={chart.id} userProps={{name: chart.name, color: chart.variableColor,
                                type: chart.type, variable: chart.variable}}
                                   data={data[chart.variable]} editState={editState}
                                   id={chart.id} deleteComponent={deleteComponent}/>
                        )
                    })
                }
                {dashboardSelected && editState &&
                <AddChart addComponent={addComponent} filteredDashboardComps={filteredDashboardComps} editState={editState}/>}
                {filteredDashboardComps?.components.length === 0 && !editState &&
                    <Box height={'25rem'} width={'38rem'} borderRadius={'0.5rem'} bg={'#363636'} style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center'}} borderWidth={'0.2rem'} borderColor={'#363636'}>
                        <VStack>
                            <Text fontWeight='bold' fontSize={'1.3rem'}>No charts added yet.</Text>
                            <Text fontWeight='bold' fontSize={'1.3rem'}>Activate EDIT mode to add charts.</Text>
                        </VStack>
                    </Box>
                }
            </div>
        </>
    );
};

export default Dashboard;