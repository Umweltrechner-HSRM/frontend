import React, { useMemo } from "react";
import {
  Box,
  Button,
  Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import "../styles/styles.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getBaseURL } from "../helpers/api.jsx";
import {
  MdOutlineModeEditOutline
} from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";
import {
  createColumnHelper
} from "@tanstack/react-table";
import { TableListView } from "../components/TableListView.jsx";

const getVariables = async token => {
  return await axios.get(`${getBaseURL()}/api/variable`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const useGetVariables = () => {
  const { keycloak } = useKeycloak();
  return useQuery({
    queryKey: ["formulas"],
    queryFn: () => getVariables(keycloak.token)
  });
};

const EditDialog = ({ isOpen, onOpen, onClose, data }) => {
  return (
    <>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editing Variable "{data?.name}"</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


function VariablePage() {
  const { data, error } = useGetVariables();
  const [selected, setSelected] = React.useState(null);
  const columnHelper = createColumnHelper();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Name",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("minThreshold", {
      header: "Min Threshold",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("maxThreshold", {
      header: "Max Threshold",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("lastOverThreshold", {
      header: "Last Over Threshold",
      cell: info =>
        info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor("action", {
      header: "Actions",
      cell: ({ cell }) => {
        return (
          <Flex justifyContent={"center"} gap={2}>
            <Button onClick={() => {
              setSelected(cell.row.original);
              onOpen();
            }
            }><MdOutlineModeEditOutline /></Button>
          </Flex>
        );
      }
    })
  ], []);

  return (
    <Box h={"100%"} overflowY={"auto"}>
      {isOpen && <EditDialog data={selected} isOpen={isOpen} onClose={onClose} onOpen={onOpen} />}
      {data && <TableListView data={data.data} columns={columns} />}
    </Box>
  );
}

export default VariablePage;
