import { Tab, TabList, Tabs, useColorModeValue } from '@chakra-ui/react';
import { useKeycloak } from '@react-keycloak/web';

function DashboardTabs({ setTabIndex, setEditState, dashboards, editState }) {
  const { keycloak } = useKeycloak();

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
              _selected={{backgroundColor: useColorModeValue('blue.200', 'blue.500')}}
              boxShadow={"rgba(0, 0, 0, 0.35) 0px 2px 5px"}
              borderRadius={'0.7rem'}
              bg={useColorModeValue('gray.500', 'gray.700')}
              color="whitesmoke"
              width={'fit-content'}
              height={'2.8rem'}
              borderWidth={'0.2rem'}
              key={dash.id}>
              {dash.name}
            </Tab>
          );
        })}
        {keycloak.hasRealmRole('admin') && (
          <Tab
            _selected={{backgroundColor: useColorModeValue('blue.200', 'blue.500')}}
            boxShadow={"rgba(0, 0, 0, 0.35) 0px 2px 5px"}
            borderRadius={'0.7rem'}
            borderColor={'blue.300'}
            bg={useColorModeValue('gray.500', 'gray.700')}
            overflowX={'clip'}
            borderWidth={'0.2rem'}
            color="whitesmoke"
            height={'2.8rem'}>
            +
          </Tab>
        )}
      </TabList>
    </Tabs>
  );
}

export default DashboardTabs;
