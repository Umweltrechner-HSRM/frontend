import { Box, Button, HStack, List, VStack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons"
import LineChart2 from '../charts/ChartJsChart.jsx'
import {useState} from "react"
import EntryList from "./ChartList.jsx";



const boxStyle = {
    display: 'flex',
    backgroundColor: '#333',
    borderRadius: 20,
    color: '#eee',
    height: '40vh',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 0,
    width: '60vh',
    margin: 30,
    alignItems: 'center',
}

const PBstyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -15,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#555',
    height: '34vh',
    width: '58vh'

}



function AddBox(){

    const [showList, setShowList] = useState(false)
 
    function PlusButton(){
        return(
            <div style={boxStyle} textAlign="center" verticalAlign="middle">
                <Button style={PBstyle} onClick={() => {setShowList(!showList)}}>
                    <AddIcon w={30} h={30} />
                </Button>
            </div>
        )
    }

    function Back(){
        return(
            <div display={'flex'} justifyContent={'center'}>
                <VStack spacing={-75}>
                    <Box style={boxStyle}>
                        <EntryList/>
                    </Box>
                    {/*<Box display='flex' marginTop={'-40'} marginRight={'30'} marginLeft={'50'} justifyContent={'center'} borderRadius={'10'} align="center">*/}
                        <HStack spacing={360}>    
                            <Button background={'grey'} onClick={() => {setShowList(!showList)}}>Cancel</Button>
                            <Button background={'teal'}>Save</Button>
                        </HStack>
                    {/*</Box>*/}
                </VStack>
            </div>
        )
    }
    
    return(
        <Box >
            {!showList ?  <PlusButton/> :  <Back />}                     
        </Box>
    )
}

export default AddBox