import React, {useEffect, useState} from 'react'
import {Box, Input, Select, VStack, Text, Button, useToast, Heading} from "@chakra-ui/react";
import Chart from "react-apexcharts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import ChartPreview from "../components/ChartPreview.jsx";
import DeleteChart from "../components/DeleteChart.jsx";
import "../Grid.css"

const colors = {Teal: '#00e7b0', Blue: '#000298', Yellow: '#f5e13c'}

function CreateChart({userProps, setUserProps}) {
    const [variables, setVariables] = useState(null)
    const queryClient = useQueryClient()
    const toast = useToast()

    useQuery(['variables'],
        async () => {
            return await axios.get('http://localhost:8230/api/sensor', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
        }, {
            onSuccess: (resp) => {
                setVariables(resp.data)
            }
        }
    )

    const {mutate} = useMutation(postComponent, {
        onSuccess: (resp) => {
            toast({
                title: 'Success adding chart',
                description: `Added chart ${userProps.name}`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            setUserProps({...userProps, name: ''})
            queryClient.invalidateQueries(['components']).catch(console.log)
        }
    })

    async function postComponent() {
        return await axios.post('http://localhost:8230/api/dashboard/components', {
            name: userProps.name,
            type: userProps.type || 'LINE_CHART',
            variable: userProps.variable,
            variableColor: userProps.color || '#ffffff'
        }, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
    }

    return (
        <Box borderRadius={5} bg={'#363636'} padding={'1rem'} >
            <Text color={'white'} fontSize={'20'} fontWeight={'bold'} marginBottom={'20px'}>Create Chart</Text>
            <VStack gap={'1%'}>
                <>
                    <Text color={'white'}>Name</Text>
                    <Input color={'white'} bg={'black'} value={userProps.name}
                           onChange={e => setUserProps({...userProps, name: e.target.value})}/>
                </>
                <>
                    <Text color={'white'}>Select Variable</Text>
                    <Select placeholder={' '} color={'white'} bg={'teal.600'} variant='filled'
                            _hover={{bg: "teal.600"}}
                            onChange={e => setUserProps({...userProps, variable: e.target.value})}>
                        {variables?.map(vari => <option key={vari.name} value={vari.name}>{vari.name}</option>)}
                    </Select>
                </>
                <>
                    <Text color={'white'}>Select Type</Text>
                    <Select placeholder={'Line'} color={'white'} bg={'teal.600'} variant='filled'
                            _hover={{bg: "teal.600"}}
                            onChange={e => setUserProps({...userProps, type: e.target.value})}>
                        <option value={'AREA_CHART'}>Area</option>
                    </Select>
                </>
                <>
                    <Text color={'white'}>Select Color</Text>
                    <Select placeholder={'White'} color={'white'} bg={'teal.600'} variant='filled'
                            _hover={{bg: "teal.600"}}
                            onChange={e => setUserProps({...userProps, color: e.target.value})}>
                        {Object.keys(colors).map(color => <option key={color} value={colors[color]}>{color}</option>)}
                    </Select>
                </>
            </VStack>
            <Button onClick={() => mutate()} isDisabled={!userProps.name || !userProps.variable} colorScheme={'blue'}
                    marginTop={'20px'}>
                SAVE
            </Button>
        </Box>
    )
}


function ManageCharts() {
    const [userProps, setUserProps] = useState({name: '', type: 'LINE_CHART', variable: '', color: ''})

    return (
        <>
            <Heading>Manage Charts</Heading>
            <div className={'grid'}>
                <CreateChart userProps={userProps} setUserProps={setUserProps}/>
                <ChartPreview userProps={userProps}/>
                <DeleteChart/>
            </div>
        </>
    )
}

export default ManageCharts