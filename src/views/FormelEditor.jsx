import React, { useMemo, useState } from "react";
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
import { Mention, MentionsInput } from "react-mentions";

const defaultStyle = {
  control: {
    fontSize: 14,
    fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      minHeight: 64,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '1px solid silver',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
}

function CustomSuggestionsContainer({ value, data, onChange, onAdd }) {
  return (
    <Box>
      <MentionsInput
        value={value}
        onChange={onChange}
        placeholder={"Variable suggestions using '@'"}
        a11ySuggestionsListLabel={"Suggested variables"}
        allowSuggestionsAboveCursor={true}
        style={defaultStyle}
        customSuggestionsContainer={(children)=><div><span style={{fontWeight: "bold"}}><h2>Variables</h2></span>{children}</div>}
      >
        <Mention data={data} onAdd={onAdd} />
      </MentionsInput>
    </Box>
  )
}


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
            <Text>Are you sure you want to delete this formula?</Text>
            <Text fontSize={"small"}>*Attention: Other formulas that depend on this formula <b>will</b> get deleted.</Text>
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



const getVariables = async token => {
  return await axios.get(`${getBaseURL()}/api/variable/getAllVariables`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const useGetVariables = () => {
  const { keycloak } = useKeycloak();
  return useQuery({
    queryKey: ["variables"],
    queryFn: () => getVariables(keycloak.token)
  });
};

const EditDialog = ({ formulaId, form }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formula, setFormula] = useState("");
  const { keycloak } = useKeycloak();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: variables } = useGetVariables();

  const data = useMemo(() => {
    return variables?.data?.map(variable => {
      return {
        id: variable.name,
        display: variable.name
      }
    });
  }, [variables]);

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

  const handleMutate = () => {
    let t = formula.split('').join('');
    let matches = t.match(/@\[(.*?)]\((.*?)\)/g);
    matches.forEach(function(match) {
      let id = match.match(/\[(.*?)]/)[1];
      t = t.replace(match, id);
    });
    validate.mutate({
      formula: t
    })
  }


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
            <CustomSuggestionsContainer data={data} onChange={(e) => setFormula(e.target.value)} value={formula} />
            <Text fontSize={"small"}>*Attention: Complete change of the formula might lead to the removal of formulas that depend on this formula.</Text>
          </ModalBody>
          <ModalFooter>
            <Text mr={3} fontSize="lg">{validation}</Text>
            <Button mr={3} onClick={handleMutate}>Validate</Button>
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
      <Button size={{base: "sm", md:"md"}} leftIcon={<AddIcon />} colorScheme="teal" variant="solid" onClick={onOpen}>
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
      enableSorting: false,
      cell: info => info.getValue()
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      enableSorting: false,
      cell: info => info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor("createdBy", {
      header: "Created By",
      enableSorting: false,
      cell: info => info.getValue()
    }),
    columnHelper.accessor("changedAt", {
      header: "Changed At",
      enableSorting: false,
      cell: info => info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor("changedBy", {
      header: "Changed By",
      enableSorting: false,
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
