import {FormControl, FormLabel, Select} from "@chakra-ui/react";
import React from "react";
import {useState} from "react";
import {getUserData} from "../../variables/UserChartData.jsx";

const ChartColor = () => {
    const [color, setColor] = useState('0,4,231')
    const userData = getUserData()

    const handleChange = (e) => {
        if (!e.target.value) {
            setColor('0,4,231')
        }else {
            setColor(e.target.value)
        }
    }

    userData.color = color

    return (
        <FormControl>
            <FormLabel>Select Chart Color</FormLabel>
            <Select onChange={handleChange} placeholder='Blue' bg={'#333'}>
                <option value='201,7,7'>Red</option>
                <option value='0,231,176'>Teal</option>
            </Select>
        </FormControl>
    )
}

export default ChartColor