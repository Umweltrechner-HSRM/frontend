import {FormControl, FormLabel, Select} from "@chakra-ui/react";
import React from "react";
import {useState} from "react";
import {getUserData} from "../../variables/UserChartData.jsx";

const ChartType = () => {
    const [type, setType] = useState('area')
    const userData = getUserData()

    const handleChange = (e) => {
        if (!e.target.value) {
            setType('area')
        } else {
            setType(e.target.value)
        }
    }

    userData.type = type

    return (
        <FormControl>
            <FormLabel>Select Chart Type</FormLabel>
            <Select onChange={handleChange} placeholder='Area Chart' bg={'#333'}>
                <option value='line'>Line Chart</option>
            </Select>
        </FormControl>
    )
}

export default ChartType