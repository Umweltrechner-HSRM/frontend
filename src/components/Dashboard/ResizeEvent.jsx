import React from 'react';
import LineChart2 from '../charts/ChartJsChart';
import LineChart from '../charts/LineChart';

function ResizeEvent(width) {
    var row1 = "";
    var row2 = "";
    var columnsFromBackend = "";

    if(width <= 1250){  //hier: Extra methode, dynamisch
        row1 = [
          { id: "1", content: <LineChart/> },
          { id: "2", content: <LineChart2/> },
          { id: "3", content: <LineChart2/> },
          { id: "4", content: <LineChart/> }
        ];
        columnsFromBackend = {
          "101": {
            items: row1
          },
        }
      }
      else{
        row1 = [
          { id: "1", content: <LineChart/> },
          { id: "2", content: <LineChart2/> },
        ];
        row2 = [
          { id: "3", content: <LineChart2/> },
          { id: "4", content: <LineChart/> }
        ];
        columnsFromBackend = {
          "101": {
            items: row1
          },
          "102": {
            items: row2
          }
        }
      }

    return columnsFromBackend;
}

export default ResizeEvent;