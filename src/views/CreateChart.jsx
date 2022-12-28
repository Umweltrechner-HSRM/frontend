import React, {useEffect, useRef, useState} from 'react'
import {Box, Input, Select, VStack, Text, Button, HStack} from "@chakra-ui/react";
import {variableArray, colors, styles, lineChartOptions} from "../helpers/testData.js";
import Chart from "react-apexcharts";

function InputBox({userProps, setUserProps}) {

    return (
        <Box borderRadius={5} bg={'#363636'} maxW={'40%'} maxH={'30%'} padding={'3%'}>
            <VStack gap={'1%'}>
                <>
                    <Text color={'white'}>Name</Text>
                    <Input color={'white'} bg={'black'} onChange={e => setUserProps({...userProps, name:e.target.value})}></Input>
                </>
                <>
                    <Text color={'white'}>Select Variable</Text>
                    <Select placeholder={' '} color={'white'} bg={'teal.600'} variant='filled'
                            _hover={{bg: "teal.600"}} onChange={e => setUserProps({...userProps, variable:e.target.value})}>
                        {variableArray.map(vari => <option key={vari.name} value={vari.name}>{vari.name}</option>)}
                    </Select>
                </>
                <>
                    <Text color={'white'}>Select Style</Text>
                    <Select placeholder={' '} color={'white'} bg={'teal.600'} variant='filled'
                            _hover={{bg: "teal.600"}} onChange={e => setUserProps({...userProps, style:e.target.value})}>
                        {styles.map(style => <option key={style} value={style}>{style}</option>)}
                    </Select>
                </>
                <>
                    <Text color={'white'}>Select Color</Text>
                    <Select placeholder={' '} color={'white'} bg={'teal.600'} variant='filled'
                            _hover={{bg: "teal.600"}} onChange={e => setUserProps({...userProps, color:e.target.value})}>
                        {colors.map(color => <option key={color} value={color}>{color}</option>)}
                    </Select>
                </>
                <Button>TESTBUTTON</Button>
            </VStack>
        </Box>
    )
}

function ChartPreview({userProps}) {
    const options = {
        ...lineChartOptions,
        title: {
            text: userProps.name,
            style: {color: '#d3d3d3'} //color of text
        },
        colors: ['#26c7c7'],
        fill: {colors: ['#26c7c7'], gradient: {opacityFrom: 0.5, opacityTo: 0.0}},
        annotations: { //Line for Critical Values
            yaxis: [
                {
                    // y: userChartOptions.criticalValue,
                    borderColor: '#26c7c7', //line color
                    strokeDashArray: 0,
                }
            ],
        },
    }

    const series =
        [
            {
                name: "series-1",
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
        ]


    return (
        <Box borderRadius={5} bg={'#363636'} padding={'2%'}>
            <Chart options={options} series={series} width={'120%'}/>
        </Box>
    )
}


function CreateChart() {
    const [userProps, setUserProps] = useState({name:'', style:'',variable:'', color:''})

    return (
        <HStack gap={'5%'} margin={'3%'}>
            <InputBox userProps={userProps} setUserProps={setUserProps}/>
            <ChartPreview userProps={userProps}/>
        </HStack>
    )
}

export default CreateChart