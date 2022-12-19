import {
    VStack,
    HStack,
    Text,
    Box, Heading, Button, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure
} from "@chakra-ui/react";
import React, {useState} from "react";
import DatasetsFormula from './DatasetsFormula.jsx'
import TableCriticalValues from "./AlertSystem/TableCriticalValues.jsx";
import TableAlertType from "./AlertSystem/TableAlertType.jsx";
import {useQuery} from "@tanstack/react-query";
import {useKeycloak} from "@react-keycloak/web";

//noch offen: Längere Variablennamen testen, datenübergabe ans backend für schwellenwerte und mail/telefon, useContext einbauen,
// resp. Layout

function AlertButton({name, thresholds}){

    /*const handleClick = () => {
        console.log(JSON.stringify(thresholds));
        const requestOptions = {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(thresholds)
        };
        fetch('http://localhost:8230/api/variable/updateThreshold', requestOptions)
            .then(response => console.log(response.text()))
            .catch(error => console.log('error', error));
    }*/
    const fetchThresholds = async (token) => {
        let resp = await fetch("http://localhost:8230/api/variable/updateThreshold", {
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`,
                ContentType: "application/json",
            }
            body: JSON.stringify(thresholds)
        });
        return await resp.json();
    }
    const handleClick = () => {
        const {keycloak} = useKeycloak();

        const {data, isLoading, error} = useQuery({
            queryKey: ["settings"],
            queryFn: () => fetchThresholds(keycloak.token),
        })

        if (error) {
            return <div>Error</div>
        }
    }
    return (
        <Button onClick={handleClick}>{`${name}`}</Button>
    );
}

function AlertSystem({sensorData, thresholds, setMailFail}) {

    return (
        <VStack ml={'10'} align='stretch'>
            <Heading size='lg' color={'white'}>
                Alert System
            </Heading>
            <HStack spacing={'10%'} width="100%" align='stretch'>
                <Box width={"40%"}>
                    <TableCriticalValues sensorData={sensorData} thresholds={thresholds}/>
                </Box>
                <Box width={"40%"}>
                    <TableAlertType thresholds={thresholds} setMailFail={setMailFail}/>
                </Box>
            </HStack>
        </VStack>
    );
}

const DatasetsAlert = () => {
    const [sensorData, setSensorData] = useState([{name: 'var1'}, {name: 'var2'}])
    let thresholds = {varList:sensorData.map(elem => Object.assign(elem,{name:elem.name, lowVal:'',upVal:''})),Mail:'',Mobile:''};

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [mailFail,setMailFail] = useState(false);

    return (
        <VStack spacing={5} align='stretch'>
            <Box ml={'10'}>
                <Text fontSize="4xl" fontWeight="bold">
                    Datasets
                </Text>
            </Box>
            <Box ml={'10'}>
                <DatasetsFormula setSensorData={setSensorData}/>
            </Box>
            <Box ml={'10'}>
                <AlertSystem sensorData={sensorData} thresholds={thresholds} setMailFail={setMailFail} ></AlertSystem>
            </Box>
            <Flex display={'flex'} justifyContent={'flex-end'}>
                <Box>
                    <AlertButton name={'SAVE'} thresholds={thresholds}></AlertButton>
                </Box>
            </Flex>
            <Drawer placement='bottom' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>The e-mail address provided is invalid.</DrawerHeader>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
}
//<Button mr={'10'} onClick={() => {console.log(JSON.stringify(thresholds)); console.log(mailFail); if(mailFail)onOpen()}}>SAVE</Button>
export default DatasetsAlert;