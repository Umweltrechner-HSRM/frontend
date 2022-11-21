import {FormControl, FormLabel, Select} from "@chakra-ui/react";
import React from "react";

const ChartColor = ({userData, setUserData}) => {

    const handleChange = (e) => {
        if (!e.target.value) {
            setUserData({...userData, color: '0,4,231', animation: 1500})
        } else {
            setUserData({...userData, color: e.target.value, animation: 1500})
        }
    }

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