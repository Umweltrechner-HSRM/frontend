import {Table,Thead,Tbody,Tr,Th,Td,TableContainer,VStack,HStack,Text, Container, Checkbox, Input, Box} from "@chakra-ui/react";

//data for testing
const SENSORDATA = [
    {name: "tmp1", value: 16},
    {name: "tmp2", value: 18},
    {name: "tmp3", value: 16.5}
]

function SensorRow({data}) {
    return (
        <Tr>
            <Td><Checkbox/></Td>
            <Td>{data}</Td>
            <Td><Input htmlSize={2} width='auto'/></Td>
        </Tr>
    );
}

function TableCriticalValues({sensorData}) {
    const rows = [];
    sensorData.forEach((data) => {
            rows.push(<SensorRow data={data.name} key={data.name}/>);
        }
    )
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th colSpan='3'>Critical Values</Th>
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
            rows.push(<SensorRow data={data.name} key={data.name}/>);
        }
    )
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th colSpan='3'>Alert Type</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

function AlertSystem({sensorData}) {
    return (
        <VStack align='stretch'>
            <Text>
                Alert System
            </Text>
            <HStack spacing={20} align='stretch'>
                <Box>
                    <TableCriticalValues sensorData={sensorData}/>
                </Box>
                <Box>
                    <TableAlertType/>
                </Box>
            </HStack>
        </VStack>
    );
}

const Datasets = () => {

    return (
        <Container maxW="4xl">
            <VStack spacing={5} align='stretch'>
                <Box>
                    <Text fontSize="4xl" fontWeight="bold">
                        Datasets
                    </Text>
                </Box>
                <Box color='black'>
                    !!! TO DO DATA PREVIEW !!!!
                </Box>
                <Box color='black'>
                    <AlertSystem sensorData={SENSORDATA}></AlertSystem>
                </Box>
            </VStack>
        </Container>
    );
}

export default Datasets;