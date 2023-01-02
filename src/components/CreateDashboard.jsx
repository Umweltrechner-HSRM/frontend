import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import {Box, Button, FormControl, FormLabel, Input, Text, VStack} from "@chakra-ui/react";
import {useState} from "react";

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
        <Box borderRadius={'0.5rem'} bg={'#363636'} width={'40%'} padding={'1%'} margin={'2rem'}>
            <Text color={'white'} fontSize={'24'}>Create Dashboard</Text>
            <VStack alignItems={'left'} gap={'2%'} marginTop={'4%'}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    addDashboard()
                }}>
                    <FormLabel>Name</FormLabel>
                    <Input color={'white'} bg={'black'} maxLength={20}
                           onChange={e => setDashboardName(e.target.value)}/>
                </form>
                <Button onClick={() => addDashboard()} isDisabled={!dashboardName}
                        colorScheme={'blue'}>ADD</Button>
            </VStack>
        </Box>
    )
}

export default CreateDashboard