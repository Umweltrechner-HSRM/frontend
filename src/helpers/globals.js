export const lineChartOptions = {
  chart: {
    toolbar: {
      show: false
    }
  },
  tooltip: {
    enabled: false
  },
  dataLabels: {
    enabled: false
  },
  // markers:{
  //     size: 2,
  //     strokeColors: '#7eefff',
  //     strokeWidth: 3,
  // },
  xaxis: {
    type: 'datetime',
    tickPlacement: 'on',
    labels: {
      // rotate: -20,
      // rotateAlways: true,
      format: 'HH:mm:ss',
      style: {
        colors: '#ffffff',
        fontSize: '12px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400
      },
      minHeight: 40
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
        colors: '#ffffff',
        fontSize: '12px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 400
      }
    }
  },
  legend: {
    show: false
  },
  grid: {
    strokeDashArray: 5
  },

  // fill: {
  //     type: "gradient",
  //     gradient: {
  //         shade: "light",
  //         type: "vertical",
  //         shadeIntensity: 0.8,
  //         gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
  //         inverseColors: true,
  //         opacityFrom: 0.8,
  //         opacityTo: 0,
  //         stops: [],
  //     },
  // },
};
