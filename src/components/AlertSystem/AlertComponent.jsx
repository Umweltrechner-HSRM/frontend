import {useKeycloak} from "@react-keycloak/web";
import {Box, Button, Heading, useToast, VStack} from "@chakra-ui/react";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import TableCriticalValues from "./TableCriticalValues.jsx";
import TableAlertType from "./TableAlertType.jsx";

//noch offen: Längere Variablennamen testen,  evtl. useContext einbauen,
// resp. Layout

const regExEMail = new RegExp('^(?:[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*|"' +
    '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
    '@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\' +
    '[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:' +
    '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$');

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
    const toast = useToast({})
    const toastIdRef = React.useRef(toast)

    const {error, refetch, isSuccess} = useQuery(["sendthres"], () => fetchThresholds(keycloak.token, thresholds),
        {
            enabled: false,
        });

    const handleClick = () => {
        if(thresholds.mail==='' || regExEMail.test(thresholds.mail)){
            refetch();
            return;
        }
        else{
            toastIdRef.current = toast({
                description: 'The E-Mail adress provided is invalid',
                status: 'error',
                duration: 1000,
                isClosable: true
            })
        }
    }

    return (
        <Button onClick={handleClick}>SAVE</Button>
    );
}

function AlertComponent({sensorData}) {

    let thresholds = {
        variables: sensorData.map(elem => Object.assign(elem, {
            name: elem.name,
            minThreshold: '',
            maxThreshold: ''
        })), mail: '', mobile: ''
    };

    return (
        <VStack align='stretch'>
            <Heading size='lg' color={'white'}>Alert System</Heading>
            <Box>
                <TableCriticalValues sensorData={sensorData} thresholds={thresholds}/>
            </Box>
            <Box>
                <TableAlertType thresholds={thresholds}/>
            </Box>
            <Box>
                <SaveButton thresholds={thresholds}/>
            </Box>
        </VStack>
    );
}

export default AlertComponent;