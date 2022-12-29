import {Box, Button, Text, Stack, IconButton, Flex, Spacer, HStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {lineChartOptions} from "../helpers/globals.js";
import ReactApexChart from "react-apexcharts";
import {RiDeleteBinLine} from "react-icons/ri"


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

const Chart = ({userProps, data, editState, id, deleteComponent}) => {
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
        <Box height={'25rem'} width={'40rem'} borderRadius={5} bg={'#363636'} style={{padding: '1rem'}}
             borderWidth={'0.2rem'} borderColor={editState ? '#d56666' : '#363636'}>
            <HStack>
                {editState &&
                    <IconButton
                        colorScheme='red' size={'sm'} isRound={true}
                        icon={<RiDeleteBinLine/>} aria-label={'delete'}
                        onClick={() => deleteComponent(id)}>
                    </IconButton>}
                <Spacer/>
                <Button
                    onClick={() => setInfoPressed(!infoPressed)} colorScheme='teal' size='sm'>
                    {infoPressed ? 'Back' : 'Show Info'}
                </Button>
            </HStack>
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