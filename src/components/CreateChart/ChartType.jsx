import {FormControl, FormLabel, Select} from "@chakra-ui/react";
import React from "react";

const ChartType = ({userData, setUserData}) => {

    const handleChange = (e) => {
        if (!e.target.value) {
            setUserData({...userData, type: 'area', animation: 1500})
        } else {
            setUserData({...userData, type: e.target.value, animation: 1500})
        }
    }

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