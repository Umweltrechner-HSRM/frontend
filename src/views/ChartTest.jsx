import LineChart from '../components/charts/LineChart.jsx'
import LineChart2 from '../components/charts/ChartJsChart.jsx'

const ChartTest = () => {
    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <div><LineChart/></div>
            <div><LineChart2/></div>
        </div>
    )
}

export default ChartTest;