import { Box, Heading } from "@chakra-ui/react";
import AddBox from '../components/Dashboard/AddChartDashboard.jsx'



const Dashboard = () => {
  return (
    <Box>
      <Heading textAlign={'center'}>Dashboard</Heading>
      <Box>
        <div style={{flexDirection: "row", display: "flex"}}>
                  <div><AddBox/></div>
        </div>
      </Box>
    </Box>


    )
};

export default Dashboard;