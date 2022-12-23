import { Box, 
        Button, 
        List, 
        ListItem,  } from "@chakra-ui/react";
import useWindowDimensions from '../Dashboard/WindowSize';


function saved(){
    
}

function EntryList(){

    const { height, width } = useWindowDimensions(); //for resize

    function Entries({name}){
        {/*const [ShowChart, setShowChart] = useState(false)*/}

        return(
            <Box>
                <Button style={EntryStyle} onClick={() => {setShowChart(!ShowChart)}}>
                    {name}
                </Button>
                {/*{!ShowChart ? null : <LineChart2/> }*/}

            </Box>
        )
    }
    const boxStyle = {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#ccc',
        borderRadius: 20,
        color: '#222',
        height: '30vh',
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 0,
        marginTop: -45,
        width: width,//'55.5vh',
    }
    
    const EntryStyle = { //Schrift
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: 20,
        color: '#222',
        height: '5vh',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 0,
        width: '50vh',
        alignItems: 'center',
    }
    return(
        <Box style={boxStyle} border={"blue 1px solid"} maxHeight={"800px"} overflow={"auto"}>
            <List spacing={2} paddingTop={2} paddingBottom={2}>
                <ListItem><Entries name="Chart1"> </Entries></ListItem>
                <ListItem><Entries name="Chart2"> </Entries></ListItem>
                <ListItem><Entries name="Chart3"> </Entries></ListItem>
                <ListItem><Entries name="Chart4"> </Entries></ListItem>
                <ListItem><Entries name="Chart5"> </Entries></ListItem>
                <ListItem><Entries name="Chart6"> </Entries></ListItem>
                <ListItem><Entries name="Chart7"> </Entries></ListItem>
                <ListItem><Entries name="Chart8"> </Entries></ListItem>
                <ListItem><Entries name="Chart9"> </Entries></ListItem>
                <ListItem><Entries name="Chart10"> </Entries></ListItem>
                <ListItem><Entries name="Chart11"> </Entries></ListItem>
                <ListItem><Entries name="Chart12"> </Entries></ListItem>
            </List>
        </Box>
    )
}

export default EntryList