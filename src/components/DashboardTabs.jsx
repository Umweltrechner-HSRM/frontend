import {Tab, TabList, Tabs} from "@chakra-ui/react";

function DashboardTabs ({setTabIndex, setEditState, dashboards}) {
    return (
        <Tabs variant='soft-rounded'
              marginLeft={'5rem'}
              colorScheme='blue'
              onChange={(index) => {
                  setTabIndex(index)
                  setEditState(false)
              }}>
            <TabList gap={1} margin={'0.5rem'}>
                {dashboards?.data.map(dash => {
                    return <Tab borderRadius={'0.7rem'} bg={'#252525'} color='whitesmoke'
                                borderWidth={'0.2rem'} key={dash.id}>{dash.name}</Tab>
                })}
                <Tab borderRadius={'0.7rem'} borderColor={'blue.300'} bg={'#252525'}
                     borderWidth={'0.2rem'} color='whitesmoke'>+</Tab>
            </TabList>
        </Tabs>
    )
}

export default DashboardTabs