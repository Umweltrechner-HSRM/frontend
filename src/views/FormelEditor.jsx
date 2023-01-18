import React, { useState } from "react";
import {
  Box, Button,
  Flex,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select,
  Textarea,
  useDisclosure, useToast
} from "@chakra-ui/react";
import "../styles/styles.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBaseURL } from "../helpers/api.jsx";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";
import {
  createColumnHelper
} from "@tanstack/react-table";
import { AddIcon } from "@chakra-ui/icons";
import { TableListView } from "../components/TableListView.jsx";

const editFormula = async (token, data) => {
  return await axios.put(`${getBaseURL()}/api/formula/${data.id}`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};

const useEditFormula = () => {
  const { keycloak } = useKeycloak();
  return useMutation({
    mutationFn: ({ data }) => editFormula(keycloak.token, data)
  });
};

const addFormula = async (token, data) => {
  return await axios.post(`${getBaseURL()}/api/formula/add`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};

const EditDialog = ({ formulaId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}><MdOutlineModeEditOutline /></Button>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editing</ModalHeader>
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

const AddDialog = () => {
  const { keycloak } = useKeycloak();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["addFormula"],
    mutationFn: (data) => addFormula(keycloak.token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["formulas"]);
      onClose();
      toast({
        position: "bottom-right",
        title: "Formula added.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        position: "bottom-right",
        title: "Error adding formula.",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  });
  const [formula, setFormula] = useState("");
  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme="teal" variant="solid" onClick={onOpen}>
        Add
      </Button>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new Formula</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea placeholder="Enter formula here"
                      onChange={(e) => setFormula(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => mutate({
              formula: formula
            })}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


const getFormulas = async (token) => {
  return await axios.get(`${getBaseURL()}/api/formula`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};

const useGetFormulas = () => {
  const { keycloak } = useKeycloak();
  return useQuery({
    queryKey: ["formulas"],
    queryFn: () => getFormulas(keycloak.token)
  });
};

function FormulaEditor() {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useGetFormulas();
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("formula", {
      header: "Formula",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: info => info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor("createdBy", {
      header: "Created By",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("changedAt", {
      header: "Changed At",
      cell: info => info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor("changedBy", {
      header: "Changed By",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("action", {
      header: "Actions",
      enableSorting: false,
      cell: ({ cell }) => {
        return (
          <Flex justifyContent={"center"} gap={2}>
            <EditDialog formulaId={cell.row.original.id} />
          </Flex>
        );
      }
    })
  ];

  return (
    <Box h={"100%"} overflowY={"auto"}>
      {data && <TableListView data={data.data} columns={columns} AddDialog={AddDialog} refetch={refetch} updatedAt={dataUpdatedAt} loading={isLoading}  />}
    </Box>
  );
}

export default FormulaEditor;
