import { HStack, Stack, StackDivider } from "@chakra-ui/react";
import DataPreview from "../components/DataPreview";
import FormInput from "../components/FormInput";

const CHANNELS = [
  {name: 'Temperature', link: '/topic/temperature'},
  {name: 'Humidity', link: '/topic/humidity'},
  {name: 'Pressure', link: '/topic/pressure'},
]


function Datasets(){
  



  return(
    
    <Stack 
      align='flex-start' 
      spacing='50px' 
      direction={{base: 'column', lg: 'row'}}
      divider={<StackDivider borderColor='inherit' />}
    >
      <DataPreview channels={CHANNELS} />
      <FormInput sensors={CHANNELS}/>
    </Stack>

  
  )
}


export default Datasets;