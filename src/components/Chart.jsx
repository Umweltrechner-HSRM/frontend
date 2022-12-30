import {Box, Button, Text, Stack, IconButton, Flex, Spacer, HStack, Center, Spinner} from "@chakra-ui/react";
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
        <Box style={{padding: 20, backgroundColor: '#4b4b4b', margin: 30, borderRadius: '0.5rem'}}>
            <Stack spacing={3}>
                <Text fontWeight='bold'>Recent received value: {data.at(-1)?.y}</Text>
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
        yaxis: {
            ...lineChartOptions.yaxis,
            max: Math.max.apply(Math, data?.slice(-20).map(d => d.y)),
            min: Math.min.apply(Math, data?.slice(-20).map(d => d.y)),
        }
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
        <Box height={'25rem'} width={'38rem'} borderRadius={'0.5rem'} bg={'#363636'} style={{padding: '1rem', position:'relative'}}
             borderWidth={'0.2rem'} borderColor={editState ? '#669ed5' : '#363636'}>
            {editState &&
                <IconButton style={{position:'absolute', bottom: '23.4rem', left: '-0.9rem'}}
                    colorScheme='red' size={'sm'} isRound={true}
                            borderWidth={'2px'}
                            borderColor={'whitesmoke'}
                    icon={<RiDeleteBinLine/>} aria-label={'delete'}
                    onClick={() => deleteComponent(id)}>
                </IconButton>}
            <HStack>
                <Spacer/>
                {data &&
                    <Button
                        onClick={() => setInfoPressed(!infoPressed)} colorScheme='teal' size='sm'>
                        {infoPressed ? 'Back' : 'Show Info'}
                    </Button>}
            </HStack>
            {infoPressed ? <InfoBox data={data} userProps={userProps}/> :
                data ? <ReactApexChart
                        height={'320px'}
                        options={chartOptions}
                        series={chartData}
                        type={userProps.type === 'AREA_CHART' ? 'area' : 'line'}/>
                    :
                    <Center marginTop={'10rem'}>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Center>
            }
        </Box>
    )
};

export default Chart;