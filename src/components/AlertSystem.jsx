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
import {useKeycloak} from "@react-keycloak/web";
import {useQuery} from "@tanstack/react-query";

//noch offen: Längere Variablennamen testen, datenübergabe ans backend für schwellenwerte und mail/telefon, useContext einbauen,
// resp. Layout
const fetchThresholds = async (token,thresholds) => {
    console.log(JSON.stringify(thresholds))
    let resp = await fetch("http://localhost:8230/api/variable/updateThreshold", {
        credentials: 'include',
        method: 'PUT',
        headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': "application/json",
        },
        body: JSON.stringify(thresholds),
    });
    return resp;
}

const useHandleClick = (thresholds) => {
    const {keycloak} = useKeycloak();

    const {data, isLoading, error} = useQuery({
        queryFn: () => fetchThresholds(keycloak.token, thresholds),
    })
    if (error) {
        console.log(error);
    }
    if (data) {
        console.log(data)
    }
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
    const {keycloak} = useKeycloak();
    const [sensorData, setSensorData] = useState([{name: 'x'}, {name: 'var1'}])
    let thresholds = {variables:sensorData.map(elem => Object.assign(elem,{name:elem.name, minThreshold:'',maxThreshold:''})),mail:'',mobile:''};

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
                    <Button onClick={() => fetchThresholds(keycloak.token,thresholds)} >SAVE</Button>
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