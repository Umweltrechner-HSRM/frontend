import {Box, Button, Flex, IconButton, Select, Text} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {HiPlus, HiOutlinePlusSm} from "react-icons/hi"
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";


function AddChart({addComponent}) {
    const [components, setComponents] = useState(null)
    const [plusClicked, setPlusClicked] = useState(false)
    const selectedComp = useRef(null)

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
            }
        }
    )

    useEffect(() => {
        if (components) selectedComp.current = components[0].id
    }, [components, plusClicked])


    return (
        <Box height={'25rem'} width={'38rem'} borderRadius={'0.5rem'} bg={'#363636'} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center'
        }} borderWidth={'0.2rem'} borderColor={'#363636'}>
            {plusClicked ?
                <Flex gap={'0.3rem'} direction={'column'}>
                    <Text color={'white'}>Select Chart</Text>
                    <Select bg={'blue.700'} width={'20rem'} onChange={(e) => selectedComp.current = e.target.value}>
                        {components?.map(comp => {
                            return <option key={comp.id} value={comp.id}>{comp.name}</option>
                        })}
                    </Select>
                    <Button marginTop={'0.5rem'} colorScheme={'blue'}
                            onClick={() => {
                                addComponent(selectedComp.current)
                                setPlusClicked(false)
                            }}>ADD</Button>
                </Flex>
                : <IconButton style={{width: '8rem', height: '8rem'}}
                              icon={<HiOutlinePlusSm size={'6rem'}/>} color={'whitesmoke'}
                              isRound={true} aria-label={'addChart'}
                              onClick={() => setPlusClicked(true)}/>
            }
        </Box>
    )
}

export default AddChart