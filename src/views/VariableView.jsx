import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { getBaseURL, getWebSocketURL } from "../helpers/api.jsx";
import { useKeycloak } from "@react-keycloak/web";
import { Client } from "@stomp/stompjs";
import { lineChartOptions } from "../helpers/globals.js";
import {
  Box,
  Flex,
  Heading, IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowLeftIcon } from "@chakra-ui/icons";

function convertData(json) {
  return { x: json.timestamp, y: +json.value.toFixed(2) };
}

let chartOptions = {
  ...lineChartOptions,
  chart: {
    ...lineChartOptions.chart,
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 500,
      animateGradually: {
        enabled: true,
        delay: 700
      },
      dynamicAnimation: {
        enabled: true,
        speed: 700
      }
    }
  },
  stroke: {
    curve: "smooth"
  },
  title: {
    show: false
  },
  colors: ["black"],
  fill: {
    opacity: [1, 1]
  },
  yaxis: {
    ...lineChartOptions.yaxis
  },
  xaxis: {
    ...lineChartOptions.xaxis,
    range: 1000
  }
};

const getVariable = async (token, id) => {
  return await axios.get(`${getBaseURL()}/api/variable/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const VariableView = () => {
  const { id } = useParams();
  const { keycloak } = useKeycloak();
  const [message, setMessage] = React.useState([]);
  const client = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (client.current == null) {
      client.current = new Client({
        brokerURL: `${getWebSocketURL()}/api/looping`,
        onConnect: () => {
          console.log("connected");
          client.current.subscribe(`/topic/${id}`, (message) => {
            setMessage((prev) => [...prev, convertData(JSON.parse(message.body))]);
          });
        }
      });
      client.current.activate();
    }
    return () => {
      console.log("unmount");
      client?.current.deactivate();
      client.current = null;
    };
  }, []);

  const chartData = [
    {
      name: "sinus",
      data: message
    }
  ];

  return (
    <Box h={"100%"} overflowY={"auto"} w={"50%"}>
      <Box p={3} pt={1} h={"100%"}>
        <Flex maxH={"7%"} h={"7%"} pr={3} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
              borderWidth={1}
              borderRadius={"5px"}
              alignItems={"center"}>
          <Box pl={3}>
            <Link to={"/variable"}><IconButton aria-label={"Back"} icon={<ArrowBackIcon />} /></Link>
          </Box>
          <Heading pl={3} size={"md"}>Variable {id}</Heading>
        </Flex>
        <Flex flexDir={"column"} h={"92%"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} mt={3} borderRadius={"5px"}
              borderWidth={1}>
          <Box flex={1} h={"90%"} overflowY={"auto"}>
            <Tabs h={"100%"} defaultIndex={1}>
              <Flex flexDirection={"column"} h={"100%"} gap={2}>
                <TabList>
                  <Tab isDisabled>Live</Tab>
                  <Tab>History</Tab>
                </TabList>
                <TabPanels flex={1}>
                  <TabPanel h={"100%"}>
                  </TabPanel>
                  <TabPanel>
                    <p>two!</p>
                  </TabPanel>
                </TabPanels>
              </Flex>
            </Tabs>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default VariableView;