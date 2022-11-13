import { Box, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useKeycloak } from "@react-keycloak/web";

const fetchSettings = async (token) => {
  let resp = await fetch("http://localhost:8230/api/v1/test/secret", {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    }
  });
  return await resp.json();
}


const Settings = () => {
  const {keycloak} = useKeycloak();

  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchSettings(keycloak.token),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <Box>
      <Heading>Settings</Heading>
      <Text>{JSON.stringify(data)}</Text>
    </Box>
  )
}

export default Settings;