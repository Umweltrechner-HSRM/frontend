import {FormControl, FormLabel, Input} from "@chakra-ui/react";


const ChartName = ({userData, setUserData}) => {

    const handleChange = (e) => {
        setUserData({...userData, name: e.target.value, animation: 0})
    }

    return (
        <FormControl>
            <FormLabel>Name</FormLabel>
            <Input onChange={handleChange} type='name'/>
        </FormControl>
    )
}

export default ChartName