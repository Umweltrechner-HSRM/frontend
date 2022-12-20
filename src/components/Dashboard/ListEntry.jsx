import { Box, Button, HStack } from "@chakra-ui/react";


function Entry(){
    const boxStyle = {
        backgroundColor: '#fff',
        borderRadius: 20,
        color: '#eee',
        height: 50,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 0,
        width: 450,
        margin: 30,
        alignItems: 'center',
    }
    return(
        <div style={boxStyle}>
            <HStack>
                name
                chart
            </HStack>
        </div>
    )
}