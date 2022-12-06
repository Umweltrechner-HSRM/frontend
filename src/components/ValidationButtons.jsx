import { Button, Text, HStack, useQuery } from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";

const validate = async (token) => {
    let resp = await fetch("http://localhost:8230/api/formula/validate", {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: "application/json",
      }
    });
    return await resp.json();
  }



function ValidationButtons(){
    let validateMessage = ''

    const {keycloak} = useKeycloak()

    const {data, isLoading, error, isSuccess} = useQuery({
        queryKey:['validate'],
        queryFn: () => validate(keycloak.token)
    })

    if(isLoading){
        validateMessage='Loading...'
    }
    if(error){
        validateMessage='Error'
    }
    if(isSuccess){
        validateMessage='Success'
    }

    return(
        <HStack>
            <Text>{validateMessage}</Text>
            <Button>Validate</Button>
            <Button>Validate & Save</Button>
        </HStack>
    )
}

export default ValidationButtons