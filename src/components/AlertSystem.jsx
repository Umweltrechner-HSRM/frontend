import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    VStack,
    HStack,
    Text,
    Checkbox,
    Input,
    Box, Heading, Button, Flex, Drawer,DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure
} from "@chakra-ui/react";
import React, {useState} from 'react';
import DatasetsFormula from './DatasetsFormula.jsx'
import TableCriticalValues from "./AlertSystem/TableCriticalValues.jsx";
import TableAlertType from "./AlertSystem/TableAlertType.jsx";

//ToDo: Längere Variablennamen testen, tooltips, datenübergabe ans backend für schwellenwerte und mail/telefon

function AlertSystem({sensorData, thresholds, mailFail}) {

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
                    <TableAlertType thresholds={thresholds} mailFail={mailFail}/>
                </Box>
            </HStack>
        </VStack>
    );
}

const DatasetsAlert = () => {
    const [sensorData, setSensorData] = useState([{name: 'var1'}, {name: 'var2'}])
    let thresholds = {};
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
                <AlertSystem sensorData={sensorData} thresholds={thresholds} mailFail={setMailFail}></AlertSystem>
            </Box>
            <Flex display={'flex'} justifyContent={'flex-end'}>
                <Box>
                    <Button mr={'10'} onClick={() => {console.log(JSON.stringify(thresholds)); console.log(mailFail); if(mailFail)onOpen()}}>SAVE</Button>
                </Box>
            </Flex>
            <Drawer placement='bottom' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>E-Mail is invalid. Please check!</DrawerHeader>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
}

export default DatasetsAlert;