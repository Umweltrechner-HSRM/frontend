import { Box, Button, HStack, List, VStack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons"
import {useState} from "react"
import EntryList from "./ChartList.jsx";
import {useColorModeValue} from "@chakra-ui/react";
import useWindowDimensions from '../Dashboard/WindowSize';

function AddBox(){

    const { height, width } = useWindowDimensions(); //for resize
    const boxColor = useColorModeValue("lightyellow","#333"); //colors day/nightmode
    const cursorColor = useColorModeValue("black","white");
    var boxSize = (width < 1250) ? width/1.45 : width/2.8;

    const boxStyle = {
        display: 'flex',
        backgroundColor: boxColor, //box
        borderRadius: 20,
        color: cursorColor,  //curser
        height: 380,
        paddingRight: 60,
        paddingLeft: 60,
        paddingTop: 20,
        paddingBottom: 20,
        width: boxSize,
        margin: 30,
        alignItems: 'center',
    }
    
    const PBstyle = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: -15,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: boxColor,
        height: '34vh',
        width: '58vh'
    
    }

    const [showList, setShowList] = useState(false)
 
    function PlusButton(){
        return(
            <div style={boxStyle} textalign="center" verticalalign="middle">
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
                        <HStack spacing={230}> {/*360 before, changed for better resizing*/ }
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