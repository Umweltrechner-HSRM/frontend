import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import {useEffect, useRef, useState} from "react";
import {Box, Button, Select, Text, VStack, useToast} from "@chakra-ui/react";


function DeleteChart () {
    const [currentCharts, setCurrentCharts] = useState([])
    const selectedChart = useRef(null)
    const toast = useToast()

    const getCharts = useQuery(['components'],
        async () => {
            return await axios.get('http://localhost:8230/api/dashboard/components', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
        }, {
            onSuccess: (resp) => {
                selectedChart.current = resp.data[0]?.id
                setCurrentCharts(resp.data)
            }
        }
    )

    const {mutate} = useMutation(deleteChart, {
        onSuccess: () => {
            selectedChart.current = currentCharts[0].id
            toast({
                title: 'Success',
                description: `Deleted chart`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            getCharts.refetch().catch(console.log)
        }, onError: (error) =>{
            if (error.response.status === 424) {
                toast({
                    title: 'Error deleting chart',
                    description: "Cannot delete chart that is used in dashboard",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        }
    })

    async function deleteChart () {
        return await axios.delete('http://localhost:8230/api/dashboard/components/' + selectedChart.current,
            {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
    }


    return(
        <Box borderRadius={5} bg={'#363636'} height={'180px'} width={'300px'} padding={'3%'}>
            <Text color={'white'} fontSize={'20'} fontWeight={'bold'} marginBottom={'1rem'}>Delete Chart</Text>
            <VStack gap={3}>
                <Select onChange={(e) => selectedChart.current = e.target.value}>
                    {currentCharts?.map(comp => {
                        return <option key={comp.id} value={comp.id}>{comp.name}</option>
                    })}
                </Select>
                <Button colorScheme={'blue'} onClick={() => mutate()}>DELETE</Button>
            </VStack>
        </Box>
    )
}

export default DeleteChart