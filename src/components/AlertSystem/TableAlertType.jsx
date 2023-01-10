import {Box,Checkbox,Input,Table,TableContainer,Tbody,Td,Th,Thead,Tr,} from "@chakra-ui/react";
import React, {useState} from "react";

function SignalRow({data, thresholds}) {
    const [check, setCheck] = useState(false);
    const [inputData, setInputData] = useState('');

    thresholds[`${data}`] = inputData;

    return (
        <Tr>
            <Td><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) => {setCheck(!check); setInputData('');}}/></Td>
            <Td><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>{data}</Box></Td>
            <Td><Input type={data==='mail' ? 'email' : 'number'} bg={'white'} color={'black'} isDisabled={!check} value={inputData}
                       onChange={(e) => setInputData(e.target.value)}/></Td>
        </Tr>
    );
}

function TableAlertType({thresholds}) {
    const table_data = [{name: 'mail'}, {name: 'mobile'}];
    const rows = [];

    table_data.forEach((data) => {
            rows.push(<SignalRow data={data.name} key={data.name} thresholds={thresholds} />);
        }
    )

    return (
        <TableContainer >
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th colSpan='4'>Alert Type</Th>
                    </Tr>
                </Thead>
                <Tbody>{rows}</Tbody>
            </Table>
        </TableContainer>
    );
}

export default TableAlertType;