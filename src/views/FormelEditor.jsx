import React, { useState } from "react";
import {
  Box, Button,
  Flex, HStack,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select,
  Text,
  Textarea,
  useDisclosure, useToast
} from "@chakra-ui/react";
import "../styles/styles.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBaseURL } from "../helpers/api.jsx";
import { MdOutlineDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";
import {
  createColumnHelper
} from "@tanstack/react-table";
import { AddIcon } from "@chakra-ui/icons";
import { TableListView } from "../components/TableListView.jsx";
import { TbAlertTriangle } from "react-icons/tb";


const DeleteModal = React.memo(({ formula }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { keycloak } = useKeycloak();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteFormula"],
    mutationFn: () => deleteFormula(keycloak.token, formula.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["formulas"]);
      onClose();
      toast({
        position: "bottom-right",
        title: "Formula deleted.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        position: "bottom-right",
        title: "Error deleting formula.",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  });
  return (
    <>
      <Button onClick={onOpen}><MdOutlineDeleteOutline /></Button>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <TbAlertTriangle size={"40px"} color={"#ee5656"} />
              <Text>Delete Formula</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this formula?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => {
              mutate();
              onClose();
            }}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

const editFormula = async (token, data) => {
  return await axios.put(`${getBaseURL()}/api/formula/${data.id}`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};

const deleteFormula = async (token, data) => {
  return await axios.delete(`${getBaseURL()}/api/formula/${data}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

const validateFormula = async (token, data) => {
  return await axios.post(`${getBaseURL()}/api/formula/validate`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};

const EditDialog = ({ formulaId, form }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formula, setFormula] = useState("");
  const { keycloak } = useKeycloak();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [validation, setValidation] = useState("");


  const edit = useMutation({
    mutationKey: ["editFormula"],
    mutationFn: (data) => editFormula(keycloak.token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["formulas"]);
      onClose();
      toast({
        position: "bottom-right",
        title: "Formula modified.",
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

  const validate = useMutation({
    mutationKey: ["validateFormula"],
    mutationFn: (data) => validateFormula(keycloak.token, data),
    onSuccess: () => {
      setValidation("Valid");
    },
    onError: (data) => {
      let message = data.response.data;
      message = message.split(/^(.*?): /gm).pop();
      setValidation(message);
    }
  });

  return (
    <>
      <Button onClick={() => {
        setFormula(form);
        onOpen();
      }}

      ><MdOutlineModeEditOutline /></Button>
      <Modal isCentered={true} isOpen={isOpen} onClose={() => {
        onClose();
        setValidation("");
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Formula</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea placeholder="Enter Formula here"
                      defaultValue={formula}
                      onChange={(e) => setFormula(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Text mr={3} fontSize="lg">{validation}</Text>
            <Button mr={3} onClick={() => validate.mutate({
              formula: formula
            })}>Validate</Button>
            <Button
              mr={3}
              onClick={() => edit.mutate({
                id: formulaId,
                formula: formula
              })}
            >Save</Button>
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

  const add = useMutation({
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

  const validate = useMutation({
    mutationKey: ["validateFormula"],
    mutationFn: (data) => validateFormula(keycloak.token, data),
    onSuccess: () => {
      setValidation("Valid");
    },
    onError: (data) => {
      let message = data.response.data;
      message = message.split(/^(.*?): /gm).pop();
      setValidation(message);
    }
  });


  const [formula, setFormula] = useState("");
  const [validation, setValidation] = useState("");


  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme="teal" variant="solid" onClick={onOpen}>
        Add
      </Button>
      <Modal isCentered={true} isOpen={isOpen} onClose={() => {
        onClose();
        setValidation("");
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new Formula</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea placeholder="Enter formula here"
                      onChange={(e) => setFormula(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Text mr={3} fontSize="lg">{validation}</Text>

            <Button mr={3} onClick={() => validate.mutate({
              formula: formula
            })}>Validate</Button>
            <Button onClick={() => add.mutate({
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
  const { keycloak } = useKeycloak();
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
      cell: ({ cell }) => (
        keycloak.hasRealmRole("admin") && (
          <Flex justifyContent={"center"} gap={2}>
            <EditDialog formulaId={cell.row.original.id} form={cell.row.original.formula} />
            <DeleteModal formula={cell.row.original} />
          </Flex>
        )
      )
    })
  ];

  return (
    <Box h={"100%"} overflowY={"auto"}>
      {data && <TableListView data={data.data} columns={columns} AddDialog={keycloak.hasRealmRole("admin") && AddDialog}
                              refetch={refetch} updatedAt={dataUpdatedAt} loading={isLoading} />}
    </Box>
  );
}

export default FormulaEditor;
