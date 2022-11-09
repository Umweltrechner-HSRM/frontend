export const testChartData = [
    {
        name: "Mobile apps",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
    {
        name: "Websites",
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
    },
];



export const lineChartOptions = {
    chart: {
        // animations: {
        //     enabled: true,
        //     easing: 'easein',
        //     speed: 800,
        //     animateGradually: {
        //         enabled: true,
        //         delay: 1000
        //     },
        //     dynamicAnimation: {
        //         enabled: true,
        //         speed: 400
        //     }
        // },
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
        type: 'datetime',
        labels: {
            rotate: -30,
            rotateAlways: true,
            format: 'HH:mm:ss',
            style: {
                colors: "#c8cfca",
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
                colors: "#c8cfca",
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
    fill: {
        type: "gradient",
        gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [],
        },
    },
    annotations: {
        yaxis: [
            {
                y: 1.4,
                borderColor: "#e30000",
                strokeDashArray: 0,
            }
        ],
    }
};
