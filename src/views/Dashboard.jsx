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
    GridItem, Grid
} from "@chakra-ui/react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import {useEffect, useRef, useState} from "react";
import ChartPreview from "../components/ChartPreview.jsx";


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


const Dashboard = () => {
    const [components, setComponents] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)
    const selectedComp = useRef(null)
    const [filteredDashboardComps, setFilteredDashboardComps] = useState(null)
    const queryClient = useQueryClient()


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
                selectedComp.current = resp.data[0].id
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

    useEffect(() => {
        if (dashboards && tabIndex !== dashboards.data.length) {
            setFilteredDashboardComps(dashboards.data.filter(dashboard => dashboard.id === dashboards.data[tabIndex].id)[0])
        }
    }, [tabIndex, dashboards])

    return (dashboards &&
        <Box>
            <Heading>Dashboard</Heading>
            <Tabs variant='soft-rounded' colorScheme='blue' onChange={(index) => setTabIndex(index)}>
                <HStack style={{margin: '0% 0% 2% 4%'}}>
                    <TabList gap={1} marginTop={'3%'}>
                        {dashboards.data.map(dash => {
                            return <Tab key={dash.id}>{dash.name}</Tab>
                        })}
                        <Tab>+</Tab>
                    </TabList>
                </HStack>
                <div style={{margin: '4%'}}>
                    {tabIndex === dashboards.data.length && <CreateDashboard/>}
                </div>
            </Tabs>
            {tabIndex !== dashboards.data.length &&
                <>
                    <Text color={'white'}>Select Chart</Text>
                    <Select onChange={(e) => selectedComp.current = e.target.value}>
                        {components?.map(comp => {
                            return <option key={comp.id} value={comp.id}>{comp.name}</option>
                        })}
                    </Select>
                    <Button onClick={() => addComponent()}>ADD</Button>
                </>
            }
            <Grid templateColumns='repeat(2, 1fr)' gap={20} style={{margin: '3% 13% 0% 9%'}}>
                {tabIndex !== dashboards.data.length && filteredDashboardComps?.components.map(chart => {
                    return (
                        <GridItem key={chart.id}>
                            <ChartPreview userProps={{name: chart.name, color: chart.variableColor, type: chart.type}}/>
                        </GridItem>
                    )
                })}
            </Grid>
        </Box>
    );
};

export default Dashboard;