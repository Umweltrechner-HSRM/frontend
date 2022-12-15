import {
    Box,
    Checkbox,
    Input,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React, {useState} from "react";

const regExEMail = new RegExp('^(?:[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*|"' +
    '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
    '@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\' +
    '[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:' +
    '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$');

function setThresholdVal(val, state) {
    !/^[0-9]+$/.test(val) ? state('') : state(val);
}

function SignalRow({data, thresholds, mailFail}) {
    const [check, setCheck] = useState(false);
    const [mail, setMail] = useState({input:'',validMail:''});
    const [mobile, setMobile] = useState('');

    const handleEMailChange = React.useCallback((e) => {
        if(regExEMail.test(e.target.value)){
            setMail({...mail, input: e.target.value, validMail:e.target.value});
            mailFail(false);
        }
        else{
            setMail({...mail, input:e.target.value, validMail:''});
            mailFail(true);
        }
    });

    if(data==='Mail') {
        thresholds[`${data}`] = mail.validMail;
        return (
            <Tr>
                <Td width={"10%"}><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) => setCheck(!check)}/></Td>
                <Td width={"30%"}><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>
                    {data}</Box></Td>
                <Td width={"60%"}><Input bg={'white'} color={'black'} isDisabled={!check} value={mail.input}
                                         onChange={handleEMailChange}/></Td>
            </Tr>
        );
    }
    thresholds[`${data}`] = mobile;
    return (
        <Tr>
            <Td width={"10%"}><Checkbox bg='#04B4AE' isChecked={check} onChange={(e) => {
                setCheck(!check);
            }}/></Td>
            <Td width={"30%"}><Box bg='#0B615E' color='white' p='2.5' borderRadius='15px' align={'center'}>
                {data}</Box></Td>
            <Td width={"60%"}><Input bg={'white'} color={'black'} isDisabled={!check} value={mobile}
                                     onChange={(e) => setThresholdVal(e.target.value, setMobile)}/></Td>
        </Tr>
    );
}

function TableAlertType({thresholds, mailFail}) {
    const table_data = [{name: 'Mail'}, {name: 'Mobile'}];
    const rows = [];

    table_data.forEach((data) => {
            rows.push(<SignalRow data={data.name} key={data.name} thresholds={thresholds} mailFail={mailFail}/>);
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
                <Tbody>{rows}</Tbody>
            </Table>
        </TableContainer>
    );
}

export default TableAlertType;