import {FormControl, FormLabel, Input} from "@chakra-ui/react";
import {useState} from "react";
import {getUserData} from '../../variables/UserChartData.jsx'


const ChartName = () => {
    const [name, setName] = useState('')
    const userData = getUserData()

    const handleChange = (e) => {
        setName(e.target.value)
    }

    userData.name = name

    return (
        <FormControl>
            <FormLabel>Name</FormLabel>
            <Input onChange={handleChange} type='name' value={name}/>
        </FormControl>
    )
}

export default ChartName