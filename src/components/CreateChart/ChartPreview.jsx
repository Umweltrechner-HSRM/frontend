import React, {useEffect, useState} from 'react';
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {Box, Heading} from '@chakra-ui/react'
import {getUserData} from '../../variables/UserChartData.jsx'

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


const ChartPreview = () => {
    let userData = getUserData()

    const [state, setState] = useState({
            labels: ['13:07:22', '13:07:23', '13:07:24', '13:07:25', '13:07:26', '13:07:27', '13:07:28'],
            datasets: [
                {
                    backgroundColor: 'rgb(51,51,51)',
                    borderColor: 'rgb(51,51,51)',
                    lineTension: 0.3,
                    fill: true,
                    id: 1,
                    borderWidth: "2",
                    data: [5, 3, 7, 2, 2, 4, 1],
                },
            ],
        }
    )

    useEffect(() => {
        const interval = setInterval(() => {
            userData = getUserData()
            setState({
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
            })
        }, 100)
        return () => clearInterval(interval)
    }, [userData]);


    const options = {
        animation: {
            duration: 0
        }
    }

    return (
        <Box style={boxStyle}>
            <Heading>Preview</Heading>
            <Chart type='line' data={state} options={options}/>
        </Box>
    )
}

export default ChartPreview
