import {HStack, Stack, StackDivider} from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "@tanstack/react-query";
import DataPreview from "./DataPreview.jsx";
import FormInput from "./FormInput.jsx";

const CHANNELS = [
    {name: 'Temperature', link: '/topic/temperature'},
    {name: 'Humidity', link: '/topic/temperature'},
    {name: 'Pressure', link: '/topic/temperature'},
]

const fetchVariables = async (token) => {
    let resp = await fetch("http://localhost:8230/api/variable", {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/json",
        }
      });
      return await resp.json();
}



function DatasetsFormula({setSensorData}) {
    const {keycloak} = useKeycloak()

    const{data, isLoading, error} = useQuery({
        queryKey: ['variables'],
        queryFn:() => fetchVariables(keycloak.token),
    })

    if(isLoading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error</div>
    }


    let vars = []
    data.forEach(item =>{
        vars.push({name:item,link:`/topic/${item}`})
    })


    return (
        <div style={{margin:20, paddingBottom:70, paddingLeft:20}}>
            <Stack
            align='flex-start'
            spacing='50px'
            direction={{base: 'column', lg: 'row'}}
            divider={<StackDivider borderColor='inherit'/>}
        >
            <DataPreview channels={vars}/>
            <FormInput sensors={vars} setSensorData={setSensorData} />
        </Stack>
        </div>

    )
}


export default DatasetsFormula;