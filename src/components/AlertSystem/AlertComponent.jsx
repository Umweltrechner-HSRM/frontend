import {useKeycloak} from "@react-keycloak/web";
import {
    Box,
    Button,
    Heading,
    useToast,
    VStack,
    Stack,
    ModalContent,
    ModalCloseButton,
    ModalOverlay,
    ModalBody,
    Modal,
    ModalFooter,
    ModalHeader,
    Text,
    useDisclosure,
    StackDivider
} from "@chakra-ui/react";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import TableCriticalValues from "./TableCriticalValues.jsx";
import TableAlertType from "./TableAlertType.jsx";
import {getKeyValue} from "eslint-plugin-react/lib/util/ast.js";
import axios from "axios";
import {getBaseURL} from "../../helpers/api.jsx";
import keycloak from "../../keycloak.js";

const boxStyle = {
    backgroundColor: '#333',
    borderRadius: 20,
    color: '#eee',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    margin: 30,
    alignItems: 'center',
    width: 530,
    height: 350
}

const regExEMail = new RegExp('^(?:[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*|"' +
    '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
    '@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\' +
    '[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:' +
    '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$');


async function fetchThresholds(token,thresholds){
    console.log(thresholds)
    return await axios.put(
        `${getBaseURL()}/api/variable/updateThreshold`,
            thresholds
        ,
        {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        }
    );
}

function SaveButton({thresholds}) {
    const {keycloak} = useKeycloak();
    const toast = useToast({})
    const {isOpen, onOpen, onClose} = useDisclosure()
    let successMessage = `The following data has been saved:\n`;
    for(const val of thresholds.variables){
        successMessage = successMessage.concat(`Variable: "${val.name}" min: ${val.minThreshold || '-'} max: ${val.maxThreshold || '-'}\n`)
    }
    successMessage = successMessage.concat(`Mail: ${thresholds.mail || '-'} \n Mobile: ${thresholds.mobile || '-'}`)
    const {error, refetch, isSuccess} = useQuery(["sendthres"], () => fetchThresholds(keycloak.token, thresholds),
        {
            enabled: false,
            onSuccess: () => {onOpen();}
        });

    const handleClick = () => {
        if(thresholds.mail==='' || regExEMail.test(thresholds.mail)){
            refetch();
            return;
        }
        else{
            toast({
                description: 'The E-Mail adress provided is invalid',
                status: 'error',
                duration: 1000,
                isClosable: true
            })
        }
    }

    return (
        <>
        <Button onClick={handleClick}>SAVE ALERTS</Button>
        {isOpen && <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent >
                    <ModalCloseButton _hover={{bg: 'whiteAlpha.200'}} color={'white'}/>
                        <>
                            <ModalHeader textAlign={'center'} fontWeight={'bold'} fontSize={'1.7rem'}
                                         color={'white'}>Alerts saved!</ModalHeader>
                                <ModalBody pb={4}>
                                    <Text align={'left'} whiteSpace='pre-line' color={'white'}>{successMessage}</Text>
                                </ModalBody>
                                <ModalFooter justifyContent={'center'}>
                                    <Button width={'100%'} mb={4} onClick={onClose}>Close</Button>
                                </ModalFooter>
                        </>
                </ModalContent>
            </Modal>}
        </>
    );
}

function AlertComponent({sensorData}) {

    const {keycloak} = useKeycloak();
    const toast = useToast({});

    let thresholds = {
        variables: sensorData.map(elem => Object.assign(elem, {
            name: elem.name,
            minThreshold: '',
            maxThreshold: ''
        })), mail: '', mobile: ''
    };

    return (
        <Box>
        <VStack align='stretch'>
            <Heading size='lg' color={'white'}>Alert System</Heading>
            <Stack
                align = 'flex-start'
                direction={{base: 'column', lg: 'row'}}
                dividers={<StackDivider borderColor='inherit' />}
            >
            <Box style={boxStyle}>
                <TableCriticalValues sensorData={sensorData} thresholds={thresholds}/>
            </Box>
            <Box style={boxStyle}>
                <TableAlertType thresholds={thresholds}/>
            </Box>
            </Stack>
            <Box>
                <SaveButton thresholds={thresholds}/>
            </Box>
        </VStack>
        </Box>
    );
}

export default AlertComponent;