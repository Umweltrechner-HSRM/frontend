import {
    VStack,
    Box,
    Heading,
} from "@chakra-ui/react";
import React, {useState} from "react";
import FormulaInput from "./FormInput/FormulaInput.jsx";
import AlertComponent from "./AlertSystem/AlertComponent.jsx";


const DatasetsAlert = () => {
    const [sensorData, setSensorData] = useState([])

    return (
        <VStack ml={'10'} spacing={5} align='stretch'>
            <Box>
                <Heading>Datasets</Heading>
            </Box>
            <Box>
                <FormulaInput setSensorData={setSensorData}/>
            </Box>
            <Box>
                <AlertComponent sensorData={sensorData}></AlertComponent>
            </Box>
        </VStack>
    );
}
export default DatasetsAlert;