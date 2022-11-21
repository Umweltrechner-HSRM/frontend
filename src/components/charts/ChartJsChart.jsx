import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import {Box} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    StreamingPlugin
);

let client = null;

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

function limitData(currentData, message) {
    if (currentData.length > 100){
        currentData = currentData.slice(-50)
    }
    return [...currentData, message];
}

function convertData(json) {
    return {x: json.timestamp, y: +json.value}
}

const data = {
    datasets: [{
        label: 'Dataset 2',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderColor: 'rgb(54, 162, 235)',
        cubicInterpolationMode: 'monotone',
        fill: true,
        data: []
    }],
}

function Test({dataPoint}) {
    return(
    <Line data={data}
        options={{
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 30_000,
                        delay: 5000,
                        refresh: 300,
                        frameRate: 30,
                        onRefresh: chart => {
                            chart.data.datasets.forEach(dataset => {
                                dataset.data.push({
                                    x: dataPoint.at(-1)?.x,
                                    y: dataPoint.at(-1)?.y
                                });
                            });
                        }
                    }
                }
            }
        }}
    />)
}

const LineChart2 = () => {
    const [cData, setData] = useState([]);

    useEffect(() => {
        client = new Client({
            brokerURL: "ws://localhost:8230/api/looping",
            onConnect: () => {
                console.log("connected");
                client.subscribe("/topic/temperature", (msg) => {
                    let msgJson = JSON.parse(msg.body);
                    setData((curr) => limitData(curr, convertData(msgJson)));
                });
            }
        });
        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return (<Box style={boxStyle} >
        <Test dataPoint={cData}/>
    </Box>
    );
}

export default LineChart2;
