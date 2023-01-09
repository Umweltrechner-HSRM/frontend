import React, { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import ChartPreview from '../components/ChartPreview.jsx';
import DeleteChart from '../components/DeleteChart.jsx';
import '../Grid.css';
import CreateChart from '../components/CreateChart.jsx';

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
