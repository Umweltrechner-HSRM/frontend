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
    xaxis: {
        max: 200,
        type: 'numeric',
        labels: {
            style: {
                colors: "#c8cfca",
                fontSize: "12px",
            },
        },
    },
    yaxis: {
        max: 1.0,
        min: -1.0,
        labels: {
            formatter: function (value) {
                return value.toFixed(2)
            },
            style: {
                colors: "#c8cfca",
                fontSize: "12px",
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
            opacityFrom: 0.7,
            opacityTo: 0,
            stops: [],
        },
        colors: ["#4FD1C5", "#2D3748"],
    },
    colors: ["#4FD1C5", "#2D3748"],
};
