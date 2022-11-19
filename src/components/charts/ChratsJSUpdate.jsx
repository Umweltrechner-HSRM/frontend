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

// function limitData(currentData, message) {
//     if (currentData.length > 100) {
//         currentData = currentData.slice(-50)
//     }
//     return [...currentData, message];
// }
//
// function convertData(json) {
//     return {x: Date.parse(json.timestamp), y: +json.value}
// }

const state = {
    lineChartData: {
        labels: [],
        datasets: [
            {
                type: "line",
                label: "BTC-USD",
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: "2",
                lineTension: 0.45,
                data: []
            }
        ]
    },
    lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            enabled: true
        },
        scales: {
            x:
                {
                    ticks: {
                        autoSkip: false,
                        maxTicksLimit: 20
                    }
                }

        }
    }
};

const LineChart3 = () => {

    this.chartReference = React.createRef();
    const chart = this.chartReference.current.chartInstance;

    const [cData, setData] = useState(state);

    useEffect(() => {
        client = new Client({
            brokerURL: "ws://localhost:8230/api/looping",
            onConnect: () => {
                console.log("connected");
                client.subscribe("/topic/temperature", (msg) => {
                    let msgJson = JSON.parse(msg.body);
                    const oldBtcDataSet = cData.lineChartData.datasets[0];
                    const newBtcDataSet = {...oldBtcDataSet};
                    newBtcDataSet.data.push(+msgJson.value);
                    cData.lineChartData.labels.push(new Date().toLocaleTimeString())

                    const newChartData = {
                        ...cData.lineChartData,
                        datasets: newBtcDataSet.data,
                        labels: cData.lineChartData.labels
                    };
                    setData({lineChartData: newChartData});
                    console.log(cData.lineChartData.datasets[0].data)
                });
            }
        });


        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);


    return (<Box style={boxStyle}>
            <Line data={cData.lineChartData} options={cData.lineChartOptions}/>
        </Box>
    );
}


export default LineChart3;
