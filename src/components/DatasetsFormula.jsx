import {HStack, Stack, StackDivider} from "@chakra-ui/react";
import DataPreview from "./DataPreview.jsx";
import FormInput from "./FormInput.jsx";

const CHANNELS = [
    {name: 'Temperature', link: '/topic/temperature'},
    {name: 'Humidity', link: '/topic/humidity'},
    {name: 'Pressure', link: '/topic/pressure'},
]


function DatasetsFormula() {

    return (
        <div style={{margin:20, paddingBottom:70, paddingLeft:20}}>
            <Stack
            align='flex-start'
            spacing='50px'
            direction={{base: 'column', lg: 'row'}}
            divider={<StackDivider borderColor='inherit'/>}
        >
            <DataPreview channels={CHANNELS}/>
            <FormInput sensors={CHANNELS}/>
        </Stack>
        </div>

    )
}


export default DatasetsFormula;