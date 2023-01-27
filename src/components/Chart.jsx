import {
  Box,
  Button,
  Text,
  Stack,
  IconButton,
  Flex,
  Spacer,
  HStack,
  Center,
  Spinner,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import { memo, useEffect, useRef, useState } from 'react';
import { lineChartOptions } from '../helpers/globals.js';
import ReactApexChart from 'react-apexcharts';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getBaseURL } from '../helpers/api.jsx';
import keycloak from '../keycloak.js';


// function criticalValueColor(value) {
//     if (value > userChartOptions.criticalValue) {
//         return "#d2304e"
//     } else {
//         return "#4FD1C5"
//     }
// }

function InfoBox({ data, userProps }) {
  const lastUpdate = (new Date(data?.at(-1)?.x)).toLocaleString('de', { timeZone: 'UTC' });
  return (
    <Box style={{ padding: 20, margin: '15% 10% 15% 10%', borderRadius: '0.5rem' }}
         bg={useColorModeValue('#e7e7e7', 'gray.700')}>
      <Stack spacing={3}>
        <Text fontWeight='bold'>Recent received value: {data.at(-1)?.y}</Text>
        <Text fontWeight={'bold'}>Last Update: {lastUpdate}</Text>
        {/*<Text fontWeight='bold'>Critical Value: {userChartOptions.criticalValue}</Text>*/}
        <Text fontWeight='bold'>Variable used: {userProps.variable}</Text>
      </Stack>
    </Box>
  );
}

const Chart = memo(({ userProps, data, editState, id, deleteComponent, animation, setAnimation, isLoading }) => {
  const [infoPressed, setInfoPressed] = useState(false);
  const range = useRef(10000);

  const chartData = [
    {
      name: 'sinus',
      data: data
    }
  ];

  useEffect(() => {
    setAnimation(true);
  }, [data]);

  let chartOptions = {
    ...lineChartOptions,
    chart: {
      ...lineChartOptions.chart,
      animations: {
        enabled: animation,
        easing: 'easeinout',
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
      curve: userProps.stroke.toLowerCase() || 'smooth'
    },
    title: {
      show: false
    },
    colors: [userProps.color],
    fill: {
      opacity: userProps.type === 'AREA_CHART' ? [0.1, 0.7] : [1, 1]
    },
    xaxis: {
      type: 'datetime',
      tickPlacement: 'on',
      labels: {
        // rotate: -20,
        // rotateAlways: true,
        format: 'HH:mm:ss',
        style: {
          colors: useColorModeValue('#000000', '#fff'),
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400
        },
        minHeight: 40
      },
      range: range.current,
      axisBorder: {
        show: true,
        color: useColorModeValue('#424242', '#bebebe'),
        height: 1.5
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: useColorModeValue('#000000', '#fff')
      }
    },
    yaxis: {
      // max: 1.0,
      // min: -1.0,
      labels: {
        formatter: function(value) {
          return value.toFixed(2);
        },
        style: {
          colors: useColorModeValue('#000000', '#fff'),
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400
        }
      }
    },
    grid: {
      strokeDashArray: 6,
      borderColor: '#808080'
    }
  };

  return (
    <Box borderRadius={'5px'} boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
         style={{ padding: '1rem 1rem 0rem 1rem' }} bg={useColorModeValue('white', 'gray.800')}
         borderWidth={'2px'} borderColor={editState ? '#669ed5' : useColorModeValue('white', 'gray.700')}>
      {editState &&
        <IconButton style={{ position: 'absolute', bottom: '95%', left: '-2%' }}
                    colorScheme='red' size={'sm'} isRound={true}
                    borderWidth={'2.5px'} isLoading={isLoading}
                    borderColor={useColorModeValue('#ffcaca', 'gray.700')}
                    icon={<RiDeleteBinLine />} aria-label={'delete'}
                    onClick={() => deleteComponent(id)}>
        </IconButton>}
      <HStack>
        <Text color={useColorModeValue('#4b4b4b', '#fff')} fontWeight={'bold'}
              marginLeft={'1.5rem'}>{userProps.name}</Text>
        <Spacer />
        <Text color={useColorModeValue('#4b4b4b', '#fff')} fontWeight={'semibold'}>Range</Text>
        <Select width={'5rem'} height={'2.1rem'} variant='outline' isDisabled={editState}
                borderWidth={'2px'} bg={useColorModeValue('white', 'gray.800')}
                borderColor={useColorModeValue('gray.400', 'gray.600')}
                onChange={(e) => range.current = e.target.value}>
          <option value={10_000}>10s</option>
          <option value={20_000}>20s</option>
          <option value={30_000}>30s</option>
          <option value={40_000}>40s</option>
          <option value={50_000}>50s</option>
          <option value={60_000}>60s</option>
        </Select>
        {data &&
          <Button
            onClick={() => setInfoPressed(!infoPressed)} colorScheme='teal' size='sm'>
            {infoPressed ? 'Back' : 'Show Info'}
          </Button>}
      </HStack>
      {infoPressed ? <InfoBox data={data} userProps={userProps} /> :
        data ?
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type={userProps.type === 'AREA_CHART' ? 'area' : 'line'} />
          :
          <Center marginTop={'8rem'} marginBottom={'28%'}>
            <Text as={'span'}>Waiting for data...</Text>
            <Spinner
              ml={'0.4rem'}
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='md'
            />
          </Center>
      }
    </Box>
  );
});

export default Chart;