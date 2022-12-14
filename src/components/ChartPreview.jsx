import { Box, Text } from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import React from 'react';

function ChartPreview({ userProps }) {
  const series = [
    {
      type: 'area',
      data: [
        { x: '13:04:02', y: 30 },
        { x: '13:04:03', y: 20 },
        { x: '13:04:04', y: 40 },
        { x: '13:04:05', y: 50 }
      ]
    }
  ];

  const options = {
    chart: {
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    fill: {
      opacity: userProps.type === 'AREA_CHART' ? [0.35, 1] : [0, 0]
    },
    colors: [userProps.color || '#00e7b0'],
    tooltip: {
      enabled: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: userProps.name || 'Chart Name',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: '#ffffff'
      }
    },
    labels: series[0].data.map(_data => _data[0]),
    xaxis: {
      labels: {
        show: true,
        rotate: -50,
        rotateAlways: true,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          colors: '#ffffff',
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff',
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400
        }
      }
    }
  };

  return (
    <Box
      height={'360px'}
      borderRadius={5}
      bg={'#363636'}
      style={{ padding: '1rem' }}>
      <Text
        color={'white'}
        fontSize={'20'}
        fontWeight={'bold'}
        marginBottom={'1rem'}>
        Chart Preview
      </Text>
      <Chart
        height={'320px'}
        options={options}
        series={series}
        type={userProps.type === 'AREA_CHART' ? 'area' : 'line'}
      />
    </Box>
  );
}

export default ChartPreview;
