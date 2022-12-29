import React, {useEffect, useState} from 'react'
import {Box, Input, Select, VStack, Text, Button, HStack, Heading} from "@chakra-ui/react";
import Chart from "react-apexcharts";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import ChartPreview from "../components/ChartPreview.jsx";


const colors = {Teal: '#00e7b0', Blue: '#000298', Yellow: '#f5e13c'}

function InputBox({userProps, setUserProps}) {
    const [variables, setVariables] = useState(null)

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
            setUserProps({...userProps, name: ''})
            console.log(resp.status)
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
        <Box borderRadius={5} bg={'#363636'} maxW={'40%'} maxH={'30%'} padding={'3%'}>
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


function CreateChart() {
    const [userProps, setUserProps] = useState({name: '', type: '', variable: '', color: ''})

    return (
        <>
            <Heading>Create Chart</Heading>
            <HStack gap={'5%'} style={{margin: '5% 20% 0% 20%'}}>
                <InputBox userProps={userProps} setUserProps={setUserProps}/>
                <ChartPreview userProps={userProps}/>
            </HStack>
        </>
    )
}

export default CreateChart