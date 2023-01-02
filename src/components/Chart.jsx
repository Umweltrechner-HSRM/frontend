import {Box, Button, Text, Stack, IconButton, Flex, Spacer, HStack, Center, Spinner, Select} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
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
    const lastUpdate = (new Date(data?.at(-1)?.x)).toLocaleString('de', {timeZone: 'UTC'})
    return (
        <Box style={{padding: 20, backgroundColor: '#4b4b4b', margin: 30, borderRadius: '0.5rem'}}>
            <Stack spacing={3}>
                <Text fontWeight='bold'>Recent received value: {data.at(-1)?.y}</Text>
                <Text fontWeight={'bold'}>Last Update: {lastUpdate}</Text>
                {/*<Text fontWeight='bold'>Critical Value: {userChartOptions.criticalValue}</Text>*/}
                <Text fontWeight='bold'>Variable used: {userProps.variable}</Text>
            </Stack>
        </Box>
    )
}

const Chart = ({userProps, data, editState, id, deleteComponent, animation, setAnimation}) => {
    const [infoPressed, setInfoPressed] = useState(false)
    const range = useRef(10000)

    const chartData = [
        {
            name: "sinus",
            data: data
        }
    ]

    useEffect(() => {
        setAnimation(true)
    }, [animation])

    const chartOptions = {
        ...lineChartOptions,
        chart: {
            ...lineChartOptions.chart,
            animations: {
                enabled: animation,
                easing: 'easeinout',
                speed: 100,
                animateGradually: {
                    enabled: true,
                    delay: 1000
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 1000
                }
            },
        },
        title: {
            show: false,
        },
        colors: [userProps.color],
        fill: {
            opacity: userProps.type === 'AREA_CHART' ? [0.35, 1] : [1, 1],
        },
        yaxis: {
            ...lineChartOptions.yaxis,
            // max: Math.max.apply(Math, data?.slice(-10).map(d => d.y)),
            // min: Math.min.apply(Math, data?.slice(-10).map(d => d.y)),
        },
        xaxis: {
            ...lineChartOptions.xaxis,
            range: range.current,
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
        <Box height={'25rem'} width={'38rem'} borderRadius={'0.5rem'} bg={'#363636'}
             style={{padding: '1rem', position: 'relative'}}
             borderWidth={'0.2rem'} borderColor={editState ? '#669ed5' : '#363636'}>
            {editState &&
                <IconButton style={{position: 'absolute', bottom: '23.4rem', left: '-0.9rem'}}
                            colorScheme='red' size={'sm'} isRound={true}
                            borderWidth={'2.5px'}
                            borderColor={'whitesmoke'}
                            icon={<RiDeleteBinLine/>} aria-label={'delete'}
                            onClick={() => deleteComponent(id)}>
                </IconButton>}
            <HStack>
                <Text color={'white'} fontWeight={'bold'} marginLeft={'1.5rem'}>{userProps.name}</Text>
                <Spacer/>
                <Text color={'white'} fontWeight={'bold'}>Range</Text>
                <Select width={'5rem'} height={'2rem'} color={'white'} bg={'#2D3748'} variant='outline'
                _hover={{bg: "#3b485d"}} onChange={(e) => range.current = e.target.value}>
                        <option value={10_000}>10s</option>
                        <option value={20_000}>20s</option>
                        <option value={30_000}>30s</option>
                        <option value={60_000}>60s</option>
                </Select>
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