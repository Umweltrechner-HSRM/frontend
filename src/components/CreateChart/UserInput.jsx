import React from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Box,
    Heading,
    Select, VStack, Button
} from '@chakra-ui/react'
import ChartName from './ChartName.jsx'
import ChartType from './ChartType.jsx'
import ChartColor from "./ChartColor.jsx";

const boxStyle = {
    backgroundColor: '#333',
    borderRadius: 20,
    color: '#eee',
    height: 'auto',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 0,
    width: 550,
    margin: 20,
    alignItems: 'center',
}

function selectData(){
    return (
        <FormControl>
            <FormLabel>Select Data</FormLabel>
            <Select placeholder='Data' bg={'#333'}>
                <option value='sinus'>Sinus</option>
            </Select>
        </FormControl>
    )
}

const userInput = ({userData, setUserData, showPreviewButton}) => {
    return (
        <Box style={boxStyle}>
            <Heading style={{paddingBottom: 20}}>
                Input Parameters
            </Heading>
            <VStack spacing={'10px'} align={'left'}>
                <ChartName userData={userData} setUserData={setUserData} />
                {selectData()}
                <ChartType userData={userData} setUserData={setUserData}/>
                <ChartColor userData={userData} setUserData={setUserData}/>
                {showPreviewButton}
                <br/>
            </VStack>
        </Box>
    )
}


export default userInput