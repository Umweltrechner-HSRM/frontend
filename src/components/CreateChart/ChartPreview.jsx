import React, {useEffect, useState} from 'react';
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {Box, Heading} from '@chakra-ui/react'

const boxStyle = {
    backgroundColor: '#333',
    borderRadius: 20,
    color: '#eee',
    height: 'auto',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 0,
    width: 550,
    margin: 20,
    alignItems: 'center',
}


let data = {
    labels: ['13:07:22', '13:07:23', '13:07:24', '13:07:25', '13:07:26', '13:07:27', '13:07:28'],
    datasets: [
        {
            backgroundColor: `rgba(0,4,231, 0.2)`,
            borderColor: `rgb(0,4,231})`,
            lineTension: 0.3,
            fill: true,
            id: 1,
            borderWidth: "2",
            data: [5, 3, 7, 2, 2, 4, 1],
            label: '',
        },
    ],
}

const ChartPreview = ({userData}) => {

    const options = {
        animation: {
            duration: userData.animation
        }
    }

    data = {
        labels: ['13:07:22', '13:07:23', '13:07:24', '13:07:25', '13:07:26', '13:07:27', '13:07:28'],
        datasets: [
            {
                backgroundColor: `rgba(${userData.color}, 0.2)`,
                borderColor: `rgb(${userData.color})`,
                lineTension: 0.3,
                fill: userData.type === 'area',
                id: 1,
                borderWidth: "2",
                data: [5, 3, 7, 2, 2, 4, 1],
                label: userData.name,
            },
        ],
    }

    return (
        <Box style={boxStyle}>
            <Heading>Preview</Heading>
            <Chart type='line' data={data} options={options}/>
        </Box>
    )
}

export default ChartPreview
