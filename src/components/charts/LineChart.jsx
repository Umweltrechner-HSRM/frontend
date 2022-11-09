import {Box, Button, Text, Stack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {lineChartOptions} from "../../variables/baseChartOptions.jsx";
import {userChartOptions} from "../../variables/userChartOptions.jsx";
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
    if (value > userChartOptions.criticalValue) {
        return "#d2304e"
    } else {
        return "#4FD1C5"
    }
}

function InfoBox({data}) {
    return (
        <Box style={{padding: 20, backgroundColor: '#4b4b4b', margin: 30, borderRadius: 20}}>
            <Stack spacing={3}>
                <Text fontWeight='bold'>Recent sent value: {data.at(-1).y}</Text>
                <Text fontWeight='bold'>Critical Value: {userChartOptions.criticalValue}</Text>
                <Text fontWeight='bold'>Formula Used: None</Text>
            </Stack>
        </Box>
    )
}

const LineChart = () => {
    const [infoPressed, setInfoPressed] = useState(false)
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
        height: 380,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 0,
        width: 550,
        margin: 30,
        alignItems: 'center',
    }

    const lastUpdate = (new Date(data.at(-1)?.x)).toLocaleString('de', {timeZone: 'UTC'})

    const chartOptions = {
        ...lineChartOptions,
        title: {
            text: 'Sinus Chart | Last Update: ' + lastUpdate,
            style: {color: '#d3d3d3'}
        },
        colors: [criticalValueColor(data.at(-1)?.y)],
        fill: {colors: [criticalValueColor(data.at(-1)?.y)], gradient: {opacityFrom: 0.5, opacityTo: 0.0}},
        annotations: { //Line for Critical Values
            yaxis: [
                {
                    y: userChartOptions.criticalValue,
                    borderColor: "#e30000",
                    strokeDashArray: 0,
                }
            ],
        },
    }

    return (
        <Box style={boxStyle}>
            <div align='right'>
                <Button onClick={() => setInfoPressed(!infoPressed)} colorScheme='teal' size='sm'>
                    {infoPressed ? 'Back' : 'Show Info'}
                </Button>
            </div>
            {!infoPressed ? <ReactApexChart
                options={chartOptions}
                series={chartData}
                type="area"
                width='500'
                height="300"
            /> : <InfoBox data={data}/>}
        </Box>
    )
};

export default LineChart;