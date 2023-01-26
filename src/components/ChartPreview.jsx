import { Box, Text, useColorModeValue } from "@chakra-ui/react";
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
    colors: [userProps.variableColor || '#00e7b0'],
    tooltip: {
      enabled: false
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 5
    },
    stroke: {
      curve: userProps.stroke.toLowerCase() || 'smooth'
    },
    title: {
      text: userProps.name || 'Chart Name',
      offsetX: 10,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: useColorModeValue('#000', '#fff')
      }
    },
    labels: series[0].data.map(_data => _data[0]),
    xaxis: {
      labels: {
        show: true,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          fontSize: '12px',
          fontWeight: 400,
          colors: useColorModeValue('#000', '#fff')
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: useColorModeValue('#000', '#fff'),
          fontSize: '12px',
          fontWeight: 400
        }
      }
    }
  };

  return (
    <Box>
      <Text align={'right'} mr={'2.5rem'}
        color={'white'}
        fontSize={'20'}
        fontWeight={'bold'}
        marginBottom={'1rem'}>
        Chart Preview
      </Text>
      <Chart
        height={'150%'}
        width={'130%'}
        options={options}
        series={series}
        type={userProps.type === 'AREA_CHART' ? 'area' : 'line'}
      />
    </Box>
  );
}

export default ChartPreview;
