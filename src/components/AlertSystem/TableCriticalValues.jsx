import React, {useState} from "react";
import {Box, Checkbox, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

function setThresholdVal(val, state) {
    !/^[0-9]+$/.test(val) ? state('') : state(val);
}

function SensorRow({data, thresholds}) {
    const [check, setCheck] = useState(false);
    const [lowVal, setLowVal] = useState('');
    const [upVal, setUpVal] = useState('');

    const values = {lowVal: lowVal, upVal: upVal};
    thresholds[`${data}`] = values;

    return (
        <Tr>
            <Td width={"10%"}><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) => {
                setCheck(!check);
                setLowVal('');
                setUpVal('')
            }}/></Td>
            <Td width={"30%"}><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>
                {data}</Box></Td>
            <Td width={"30%"}><Input bg={'white'} color={'black'} isDisabled={!check} value={lowVal}
                                     onChange={(e) => setThresholdVal(e.target.value, setLowVal)}/></Td>
            <Td width={"30%"}><Input bg={'white'} color={'black'} isDisabled={!check} value={upVal}
                                     onChange={(e) => setThresholdVal(e.target.value, setUpVal)}/></Td>
        </Tr>
    );
}

function TableCriticalValues({sensorData, thresholds}) {
    const rows = [];
    sensorData.forEach((data) => {
            rows.push(<SensorRow data={data.name} key={data.name} thresholds={thresholds}/>);
        }
    )

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

export default TableCriticalValues;