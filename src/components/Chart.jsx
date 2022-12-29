import {Box, Button, Text, Stack, IconButton} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {lineChartOptions} from "../helpers/globals.js";
import ReactApexChart from "react-apexcharts";
import {RiDeleteBinLine} from "react-icons/ri"

let client = null;

const boxStyle = {
    backgroundColor: '#333',
    borderRadius: 20,
    color: '#eee',
    height: 350,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 0,
    width: 500,
    margin: 30,
    alignItems: 'center',
}

function limitData(currentData, message) {
    if (currentData.length > 2000) {
        currentData = currentData.slice(-100)
    }
    return [...currentData, message];
}

function convertData(json) {
    return {x: json.timestamp, y: +json.value}
}

// function criticalValueColor(value) {
//     if (value > userChartOptions.criticalValue) {
//         return "#d2304e"
//     } else {
//         return "#4FD1C5"
//     }
// }

function InfoBox({data, userProps}) {
    return (
        <Box style={{padding: 20, backgroundColor: '#4b4b4b', margin: 30, borderRadius: 20}}>
            <Stack spacing={3}>
                <Text fontWeight='bold'>Recent sent value: {data.at(-1)?.y}</Text>
                {/*<Text fontWeight='bold'>Critical Value: {userChartOptions.criticalValue}</Text>*/}
                <Text fontWeight='bold'>Variable used: {userProps.variable}</Text>
            </Stack>
        </Box>
    )
}

const Chart = ({userProps, data, editState, id}, _deleteComponent) => {
    const [infoPressed, setInfoPressed] = useState(false)

    const chartData = [
        {
            name: "sinus",
            data: data
        }
    ]

    const lastUpdate = (new Date(data?.at(-1)?.x)).toLocaleString('de', {timeZone: 'UTC'})

    const chartOptions = {
        ...lineChartOptions,
        title: {
            text: `${userProps.name} | Last Update: ${lastUpdate}`,
            style: {color: '#ffffff'}
        },
        colors: [userProps.color],
        fill: {
            opacity: userProps.type === 'AREA_CHART' ? [0.35, 1] : [1, 1],
        },
        // annotations: { //Line for Critical Values
        //     yaxis: [
        //         {
        //             y: userChartOptions.criticalValue,
        //             borderColor: "#e30000",
        //             strokeDashArray: 0,
        //         }
        //     ],
        // },
    }

    return (
        <Box height={'25rem'} width={'35rem'} borderRadius={5} bg={'#363636'} style={{padding: '1rem'}}
             borderWidth={'0.2rem'} borderColor={editState ? '#d56666' : '#363636'}>
            <div>
                <Button style={{float: 'right'}}
                        onClick={() => setInfoPressed(!infoPressed)} colorScheme='teal' size='sm'>
                    {infoPressed ? 'Back' : 'Show Info'}
                </Button>
                {editState &&
                    <IconButton style={{float: 'left'}}
                                colorScheme='red' size={'sm'} isRound={true}
                                icon={<RiDeleteBinLine/>} aria-label={'delete'}
                                onClick={() => _deleteComponent(id)}>
                    </IconButton>}
            </div>
            {infoPressed ? <InfoBox data={data} userProps={userProps}/> :
                <ReactApexChart
                    height={'320px'}
                    options={chartOptions}
                    series={chartData}
                    type={userProps.type === 'AREA_CHART' ? 'area' : 'line'}/>}
        </Box>
    )
};

export default Chart;