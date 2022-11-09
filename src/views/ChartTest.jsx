import {Box} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {lineChartOptions} from "../variables/charts.jsx";
import ReactApexChart from "react-apexcharts";

let client = null;

function limitData(currentData, message) {
    if (currentData.length > 200) {
        currentData.shift();
    }
    return [...currentData, message];
}


const ChartTest = () => {
    const [lastMessage, setLastMessage] = useState("No message received yet");
    const [data, setData] = useState([]);

    useEffect(() => {
        client = new Client({
            brokerURL: "ws://localhost:8230/api/looping",
            onConnect: () => {
                console.log("connected");
                client.subscribe("/topic/temperature", (msg) => {
                    let msgJson = JSON.parse(msg.body);
                    setLastMessage(msgJson);
                    setData((curr) => limitData(curr, msgJson));
                });
            }
        });
        client.activate();
        return () => {
            client.deactivate();
        };
    }, []);

    const _data = [
        {
            name: "sinus",
            data: data.map((item) => +item.value)
        }
    ]

    const style = {
        backgroundColor: '#333',
        borderRadius: 20,
        color: '#eee',
        minHeight: 300,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 30,
        paddingBottom: 10,
        width: 550,
        margin: 30
    }

    return (
        <Box style={style}>
            <ReactApexChart
                options={lineChartOptions}
                series={_data}
                type="area"
                width='500'
                height="300"
            />
        </Box>
    )
};

export default ChartTest;