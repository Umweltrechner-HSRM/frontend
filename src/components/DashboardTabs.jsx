import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";

function DashboardTabs({ setTabIndex, setEditState, dashboards, editState }) {
  const { keycloak } = useKeycloak();

  return (
    <Tabs variant="soft-rounded" defaultIndex={+localStorage.getItem("tabIndex") || 0}
          marginLeft={"5rem"}
          colorScheme="blue"
          onChange={(index) => {
            setTabIndex(index);
            localStorage.setItem("tabIndex", String(index));
            setEditState(false);
          }}>
      <TabList gap={1} margin={"0.5rem"}>
        {dashboards?.data.map(dash => {
          return <Tab borderRadius={"0.7rem"} bg={"#252525"} color="whitesmoke" width={"fit-content"}
                      height={"2.8rem"}
                      borderWidth={"0.2rem"} key={dash.id}>
            {dash.name}
          </Tab>;
        })}
        {keycloak.hasRealmRole("admin") &&
          <Tab borderRadius={"0.7rem"} borderColor={"blue.300"} bg={"#252525"} overflowX={"clip"}
               borderWidth={"0.2rem"} color="whitesmoke" height={"2.8rem"}>+</Tab>
        }
      </TabList>
    </Tabs>
  );
}

export default DashboardTabs;