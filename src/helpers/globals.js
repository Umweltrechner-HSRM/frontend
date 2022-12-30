export const lineChartOptions = {
  chart: {
    animations: {
      enabled: true,
      easing: 'linear',
      speed: 100,
      animateGradually: {
        enabled: false,
        delay: 1000
      },
      dynamicAnimation: {
        enabled: true,
        speed: 500
      }
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  // markers:{
  //     size: 2,
  //     strokeColors: '#7eefff',
  //     strokeWidth: 3,
  // },
  xaxis: {
    range: 10000,
    type: 'datetime',
    labels: {
      rotate: -30,
      rotateAlways: true,
      format: 'HH:mm:ss',
      style: {
        colors: "#ffffff",
        fontSize: "12px",
        fontWeight: 600,
      },
      minHeight: 40
    },

  },
  yaxis: {
    // max: 1.0,
    // min: -1.0,
    labels: {
      formatter: function (value) {
        return value.toFixed(2)
      },
      style: {
        colors: "#ffffff",
        fontSize: "12px",
        fontWeight: 600,
      },
    },
  },
  legend: {
    show: false,
  },
  grid: {
    strokeDashArray: 5,
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
