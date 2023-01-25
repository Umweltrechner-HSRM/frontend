import { Tab, TabList, Tabs, useColorModeValue } from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';
import {HiPlusSm} from 'react-icons/hi';

function DashboardTabs({ setTabIndex, setEditState, dashboards, editState }) {
  const { keycloak } = useKeycloak();
  const selected = useColorModeValue('blue.200', 'blue.500');
  const textColor= useColorModeValue("#4b4b4b", "#fff")

  return (
    <Tabs
      flexGrow={1}
      variant="soft-rounded"
      defaultIndex={+localStorage.getItem('tabIndex') || 0}
      colorScheme="blue"
      onChange={index => {
        setTabIndex(index);
        localStorage.setItem('tabIndex', String(index));
        setEditState(false);
      }}>
      <TabList gap={1} margin={'0.5rem'}>
        {dashboards?.data.map(dash => {
          return (
            <Tab
              _selected={{backgroundColor: selected}}
              boxShadow={"rgba(0, 0, 0, 0.35) 0px 2px 5px"}
              borderRadius={'0.7rem'}
              width={'fit-content'}
              height={'2.8rem'}
              borderWidth={'0.15rem'}
              color={textColor}
              key={dash.id}>
              {dash.name}
            </Tab>
          );
        })}
        {keycloak.hasRealmRole('admin') && (
          <Tab
            _selected={{backgroundColor: selected}}
            boxShadow={"rgba(0, 0, 0, 0.35) 0px 2px 5px"}
            borderRadius={'0.7rem'}
            borderColor={'blue.300'}
            overflowX={'clip'}
            borderWidth={'0.15rem'}
            color={textColor}
            height={'2.8rem'}>
            {<HiPlusSm />}
          </Tab>
        )}
      </TabList>
    </Tabs>
  );
}

export default DashboardTabs;
