import React, {useState} from "react";
import {Box, Checkbox, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

function setThresholdVal(val, state) {
    !/^[0-9]+$/.test(val) ? state('') : state(val);
}

function SensorRow({data, thresholds}) {
    const [check, setCheck] = useState(false);
    const [varList,setVarList] = useState(thresholds.varList);

    const handleChange = React.useCallback((name,lowVal,upVal) => {
        let newVarList = varList.map(elem => elem.name===name ? Object.assign(elem,{lowVal:lowVal,upVal:upVal}) : elem);
        setVarList(newVarList);
    })

    return (
        <Tr>
            <Td width={"10%"}><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) => {
                setCheck(!check);
                handleChange(data,'','');
            }}/></Td>
            <Td width={"30%"}><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>
                {data}</Box></Td>
            <Td width={"30%"}><Input type='number' bg={'white'} color={'black'} isDisabled={!check} value={varList.find(({name})=> name===data).lowVal}
                                     onChange={(e) => handleChange(data,e.target.value,varList.find(({name})=> name===data).upVal)}/></Td>
            <Td width={"30%"}><Input type='number' bg={'white'} color={'black'} isDisabled={!check} value={varList.find(({name})=> name===data).upVal}
                                     onChange={(e) => handleChange(data,varList.find(({name})=> name===data).lowVal,e.target.value)}/></Td>
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