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

//noch offen: Längere Variablennamen testen,  useContext einbauen,
// resp. Layout
const fetchThresholds = async (token, thresholds) => {

    let resp = await fetch("http://localhost:8230/api/variable/updateThreshold", {
        credentials: 'include',
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': "application/json",
        },
        body: JSON.stringify(thresholds),
    });

    return resp;
}

function SaveButton({thresholds}) {
    const {keycloak} = useKeycloak();

    const {isLoading, error, refetch} = useQuery(["sendthres"], () => fetchThresholds(keycloak.token, thresholds),
        {
            enabled: false,
        });
    const handleClick = () => {
        refetch();
    }
    if (error) {
        console.log(error);
    }
    return (
        <>
            <Button onClick={handleClick}>SAVE</Button>
            <Box bg='red'>{error ? 'Something went wrong, try again!' : null}</Box>
        </>
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
    const {keycloak} = useKeycloak();
    const [sensorData, setSensorData] = useState([{name: 'x'}, {name: 'var1'}])
    let thresholds = {
        variables: sensorData.map(elem => Object.assign(elem, {
            name: elem.name,
            minThreshold: '',
            maxThreshold: ''
        })), mail: '', mobile: ''
    };
    const sensorDataTest = [{name: 'x'}, {name: 'var1'}];
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [mailFail, setMailFail] = useState(false);

    return (
        <Flex
            w={{base: "100%", md: "13vw"}}
            flexDir="column"
            justifyContent="space-between"
        >
            <Flex
                flexDir={{base: "row", md: "column"}}
                alignItems={{base: "center", lg: "flex-start"}}
                as="nav"
            >
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
                        <AlertSystem sensorData={sensorDataTest} thresholds={thresholds}
                                     setMailFail={setMailFail}></AlertSystem>
                    </Box>

                    <Box>
                        <SaveButton thresholds={thresholds}/>
                    </Box>

                    <Drawer placement='bottom' onClose={onClose} isOpen={isOpen}>
                        <DrawerOverlay/>
                        <DrawerContent>
                            <DrawerHeader borderBottomWidth='1px'>The e-mail address provided is invalid.</DrawerHeader>
                        </DrawerContent>
                    </Drawer>
                </VStack>
            </Flex>
        </Flex>
    );
}
//<Button onClick={() => fetchThresholds(keycloak.token,thresholds)} >SAVE</Button>
//<Button mr={'10'} onClick={() => {console.log(JSON.stringify(thresholds)); console.log(mailFail); if(mailFail)onOpen()}}>SAVE</Button>
export default DatasetsAlert;