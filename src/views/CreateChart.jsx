import UserInput from "../components/CreateChart/UserInput";
import {Button, HStack} from '@chakra-ui/react'
import ChartPreview from "../components/CreateChart/ChartPreview.jsx";
import {useState} from "react";
import {getUserData} from '../variables/UserChartData.jsx'

const submitButtonStyle = {
    position: 'absolute',
    bottom:40,
    right:40,
}


function stack() {
    const [showPreview, setShowPreview] = useState(false)
    const [buttonText, setButtonText] = useState('Show Preview')

    const handleChange = () => {
        !showPreview ? setButtonText('Hide Preview') : setButtonText('Show Preview')
        setShowPreview(!showPreview)
    }

    function showPreviewButton (buttonText){
        return (
            <Button onClick={handleChange} bg={'teal'}>{buttonText}</Button>
        )
    }

    return(
        <HStack>
            <UserInput showPreviewButton={showPreviewButton(buttonText)}></UserInput>
            {showPreview ? <ChartPreview></ChartPreview> : <></>}
            <Button colorScheme={'teal'} style={submitButtonStyle}>Save</Button>
        </HStack>
    )
}

const createChart = () => {
    return(
        <>
            {stack()}
            <Button colorScheme={'teal'} style={submitButtonStyle}>Save</Button>
        </>
    )
}

export default createChart