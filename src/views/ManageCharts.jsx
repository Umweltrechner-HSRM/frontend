import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import ChartPreview from '../components/ChartPreview.jsx';
import DeleteChart from '../components/DeleteChart.jsx';
import '../styles/styles.css';
import CreateChart from '../components/CreateChart.jsx';
import GridLayout from "react-grid-layout";

function GridTest () {
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 }
  ];
  return (
    <GridLayout className="layout" cols={12}  width={1200}>
      <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 2}} style={{backgroundColor: 'white'}}>
        a
      </div>
      <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }} style={{backgroundColor: 'white'}}>
        b
      </div>
      <div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 2 }} style={{backgroundColor: 'white'}}>
        c
      </div>
    </GridLayout>
  );
}

function ManageCharts() {
  const [userProps, setUserProps] = useState({
    name: '',
    type: 'LINE_CHART',
    variable: '',
    color: ''
  });

  return (
    <>
      <Heading>Manage Charts</Heading>
      <div className={'grid'}>
        <CreateChart userProps={userProps} setUserProps={setUserProps} />
        <ChartPreview userProps={userProps} />
        <DeleteChart />
      </div>
    </>
  );
}

export default ManageCharts;
