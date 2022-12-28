import { Box, Heading } from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import keycloak from "../keycloak.js";
import {useState} from "react";


const Dashboard = () => {
    const [components, setComponents] = useState(null)

    useQuery(['components'],
        async () => {
            return await axios.get('http://localhost:8230/api/dashboard/components', {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
        }, {
            onSuccess: (resp) => {
                console.log(resp.data)
                setComponents(resp.data)
            }
        }
    )

  return (
    <Box>
      <Heading>Dashboard</Heading>
    </Box>
  );
};

export default Dashboard;