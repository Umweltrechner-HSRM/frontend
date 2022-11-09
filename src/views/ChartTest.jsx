import {Box} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {lineChartOptions} from "../variables/charts.jsx";
import ReactApexChart from "react-apexcharts";

let client = null;

function limitData(currentData, message) {
    if (currentData.length > 100) {
        currentData.shift();
    }
    return [...currentData, message];
}

function convertData(json) {
    return {x: Date.parse(json.timestamp), y: +json.value}
}

function criticalValueColor(value) {
        if (value > 1.4) {
            return "#d2304e"
        } else {
            return "#4FD1C5"
        }
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
                    setData((curr) => limitData(curr, convertData(msgJson)));
                });
            }
        });
        client.activate();
        return () => {
            client.deactivate();
        };
    }, []);


    const chartData = [
        {
            name: "sinus",
            data: data
        }
    ]

    const boxStyle = {
        backgroundColor: '#333',
        borderRadius: 20,
        color: '#eee',
        minHeight: 400,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 40,
        paddingBottom: 0,
        width: 550,
        margin: 30
    }

    let lastUpdate = (new Date(data.at(-1)?.x)).toLocaleString('de',{timeZone:'UTC'})

    let chartOptions = {...lineChartOptions,
        title:{text: 'Sinus Chart | Last Update: ' + lastUpdate ,
        style: {color: '#c8cfca'}},
        colors:[criticalValueColor(data.at(-1)?.y)],
        fill: {colors:[criticalValueColor(data.at(-1)?.y)]},
    }

    return (
        <Box style={boxStyle}>
            <ReactApexChart
                options={chartOptions}
                series={chartData}
                type="area"
                width='500'
                height="300"
            />
        </Box>
    )
};

export default ChartTest;