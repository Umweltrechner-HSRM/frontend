import {IconButton, Tab, TabList, Tabs} from "@chakra-ui/react";
import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from 'react-icons/md'
import {useEffect, useState} from "react";

function DashboardTabs({setTabIndex, setEditState, dashboards, editState}) {

    return (
        <Tabs variant='soft-rounded' defaultIndex={+localStorage.getItem('tabIndex') || 0}
              marginLeft={'5rem'}
              colorScheme='blue'
              onChange={(index) => {
                  setTabIndex(index)
                  localStorage.setItem('tabIndex', String(index))
                  setEditState(false)
              }}>
            <TabList gap={1} margin={'0.5rem'}>
                {dashboards?.data.map(dash => {
                    return <Tab borderRadius={'0.7rem'} bg={'#252525'} color='whitesmoke'
                                borderWidth={'0.2rem'} key={dash.id}>
                        {dash.name}
                    </Tab>
                })}
                <Tab borderRadius={'0.7rem'} borderColor={'blue.300'} bg={'#252525'}
                     borderWidth={'0.2rem'} color='whitesmoke'>+</Tab>
            </TabList>
        </Tabs>
    )
}

export default DashboardTabs