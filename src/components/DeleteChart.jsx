import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import {useEffect, useRef, useState} from "react";
import {Box, Button, Select, Text, VStack} from "@chakra-ui/react";


function DeleteChart () {
    const [currentCharts, setCurrentCharts] = useState([])
    const selectedChart = useRef(null)

    const getCharts = useQuery(['components'],
        async () => {
            return await axios.get('http://localhost:8230/api/dashboard/components', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
        }, {
            onSuccess: (resp) => {
                setCurrentCharts(resp.data)
            }
        }
    )

    const {mutate} = useMutation(deleteChart, {
        onSuccess: (resp) => {
            getCharts.refetch().catch(console.log)
        }, onError: (resp) =>{
            console.log(resp)
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
        <Box borderRadius={5} bg={'#363636'} width={'300px'} maxH={'30%'} padding={'3%'}>
            <VStack>
                <Text color={'white'} fontSize={'20'}>Delete Chart</Text>
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