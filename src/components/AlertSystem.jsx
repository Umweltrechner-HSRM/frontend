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
    Box, Heading, Button, Flex
} from "@chakra-ui/react";
import React, {useState} from 'react';
import DatasetsFormula from './DatasetsFormula.jsx'

//data for testing
const SENSORDATA = [
    {name: "tmp1", value: 16},
    {name: "tmp2", value: 18},
]

function SensorRow({data, dataDB}) {
    const [check, setCheck] = useState(false);
    const [lowVal,setLowVal] = useState('');
    const [upVal,setUpVal] = useState('');
    dataDB[`${data}Low`]=lowVal;
    dataDB[`${data}High`]=upVal;

    return (
        <Tr>
            <Td width={"10%"}><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) =>
                {!check ? setCheck(!check) : setCheck(!check); setLowVal(''); setUpVal('')}}/></Td>
            <Td width={"30%"}><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>
                {data}</Box></Td>
            <Td width={"30%"}><Input bg={'white'} color={'black'} isDisabled={!check} value={lowVal}
                                     onChange={(e) => setLowVal(e.target.value)}/></Td>
            <Td width={"30%"}><Input bg={'white'} color={'black'} isDisabled={!check}
                                     onChange={(e) => setUpVal(e.target.value)}/></Td>
        </Tr>
    );
}

function TableCriticalValues({sensorData, dataDB}) {
    const rows = [];
    sensorData.forEach((data) => {
            rows.push(<SensorRow data={data.name} key={data.name} dataDB={dataDB}/>);
        }
    )
    rows.push(<SensorRow data={"formula"} key={"formula"} dataDB={dataDB}/>)
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th colSpan={2}>Critical Values</Th>
                        <Th>Lower threshold</Th>
                        <Th>Upper threshold</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

function TableAlertType() {
    const table_data = [{name: 'Mail'}, {name: 'Mobile'}];
    const rows = [];

    table_data.forEach((data) => {
            rows.push(<SignalRow data={data.name} key={data.name}/>);
        }
    )
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th colSpan='4'>Alert Type</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

function SignalRow({data}) {
    const [check, setCheck] = useState(false);
    return (
        <Tr>
            <Td width={"10%"}><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) => setCheck(!check)}/></Td>
            <Td width={"30%"}><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>
                {data}</Box></Td>
            <Td width={"60%"}><Input bg={'white'} color={'black'} isDisabled={!check}/></Td>
        </Tr>
    );
}

function AlertSystem({sensorData, dataDB}) {

    return (
        <VStack ml={'10'} align='stretch'>
            <Heading size='lg' color={'white'}>
                Alert System
            </Heading>
            <HStack spacing={'10%'} width="100%" align='stretch'>
                <Box width={"40%"}>
                    <TableCriticalValues sensorData={sensorData} dataDB={dataDB}/>
                </Box>
                <Box width={"40%"}>
                    <TableAlertType/>
                </Box>
            </HStack>
        </VStack>
    );
}

const DatasetsAlert = () => {
    const [sensorData, setSensorData] = useState([])
    let dataDB = {};
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
                <AlertSystem sensorData={SENSORDATA} dataDB={dataDB}></AlertSystem>
            </Box>
            <Flex display={'flex'} justifyContent={'flex-end'}>
                <Box>
                    <Button mr={'10'} onClick={() => console.log(dataDB)}>SAVE</Button>
                </Box>
            </Flex>
        </VStack>
    );
}

export default DatasetsAlert;