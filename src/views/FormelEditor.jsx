import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import "../styles/styles.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBaseURL } from "../helpers/api.jsx";
import { MdOutlineDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";
import { createColumnHelper } from "@tanstack/react-table";
import { AddIcon } from "@chakra-ui/icons";
import { TableListView } from "../components/TableListView.jsx";
import { TbAlertTriangle } from "react-icons/tb";
import { Mention, MentionsInput } from "react-mentions";
import { FiRefreshCcw } from "react-icons/fi";

const defaultStyle = {
  control: {
    fontSize: 14,
    fontWeight: "normal"
  },

  "&multiLine": {
    control: {
      fontFamily: "monospace",
      minHeight: 64
    },
    highlighter: {
      padding: 9,
      border: "1px solid transparent"
    },
    input: {
      padding: 9,
      border: "1px solid silver"
    }
  },

  "&singleLine": {
    display: "inline-block",
    width: 180,

    highlighter: {
      padding: 1,
      border: "2px inset transparent"
    },
    input: {
      padding: 1,
      border: "2px inset"
    }
  }
};

const getVariablesFromMentions = (formula) => {
  let t = formula.split("").join("");
  let matches = t.match(/@\[(.*?)]\((.*?)\)/g);
  matches.forEach(function(match) {
    let id = match.match(/\[(.*?)]/)[1];
    t = t.replace(match, id);
  });
  return t;
};

const formulaToMentions = (f, variables) => {
  let t = f;
  variables.forEach(variable => {
    const match = new RegExp(`\\b${variable.name}\\b`, "g");
    if (t.match(match)) {
      t = t.replace(match, `@[${variable.name}](${variable.name})`);
    }
  });
  return t;
};

function CustomSuggestionsContainer({ value, data, onChange, onAdd }) {
  return (
    <Box>
      <MentionsInput
        value={value}
        onChange={onChange}
        placeholder={"Variable suggestions using '@'"}
        a11ySuggestionsListLabel={"Suggested variables"}
        allowSuggestionsAboveCursor={true}
        style={{
          ...defaultStyle,
          suggestions: {
            list: {
              backgroundColor: useColorModeValue("#fff", "#202023"),
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 14
            },
            item: {
              padding: "5px 15px",
              borderBottom: "1px solid rgba(0,0,0,0.15)",
              "&focused": {
                backgroundColor: useColorModeValue("#cee4e5", "#2D3748")
              }
            }
          }
        }}
      >
        <Mention data={data} onAdd={onAdd} style={{
          backgroundColor: useColorModeValue("#cee4e5", "#2D3748")
        }} />
      </MentionsInput>
    </Box>
  );
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
            <Text fontSize={"small"}>*Attention: Other formulas that depend on this formula <b>will</b> get
              deleted.</Text>
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

const getFormulas = async (token) => {
  return await axios.get(`${getBaseURL()}/api/formula`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};

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

const getVariables = async (token) => {
  return await axios.get(`${getBaseURL()}/api/variable/getAllVariables`, {
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

const useGetVariables = () => {
  const { keycloak } = useKeycloak();
  return useQuery({
    queryKey: ["variables"],
    queryFn: () => getVariables(keycloak.token)
  });
};

const EditDialog = ({ formulaId, form, isOpen, onClose, isNew = false }) => {
  const [formula, setFormula] = useState("");
  const [validation, setValidation] = useState("");
  const { keycloak } = useKeycloak();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: variables } = useGetVariables();

  const data = useMemo(() => {
    return variables?.data?.map(variable => {
      return {
        id: variable.name,
        display: variable.name
      };
    });
  }, [variables]);

  useEffect(() => {
    if (form && variables?.data) {
      setFormula(formulaToMentions(form, variables.data));
    }
  }, [variables, form]);


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

  const handleValidate = () => {
    let t = getVariablesFromMentions(formula);
    validate.mutate({
      formula: t
    });
  };

  const handleEdit = () => {
    let t = getVariablesFromMentions(formula);
    if (isNew) {
      add.mutate({
        formula: t
      });
    } else {
      edit.mutate({
        id: formulaId,
        formula: t
      });
    }
  };


  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={() => {
      onClose();
    }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isNew ? "New" : "Edit"} Formula</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CustomSuggestionsContainer data={data} onChange={(e) => setFormula(e.target.value)} value={formula} />
          <Text fontSize={"small"}>*Attention: Complete change of the formula might lead to the removal of formulas
            that depend on this formula.</Text>
        </ModalBody>
        <ModalFooter>
          <Text mr={3} fontSize="lg">{validation}</Text>
          <Button mr={3} onClick={handleValidate}>Validate</Button>
          <Button
            mr={3}
            onClick={handleEdit}
          >Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function FormulaEditor() {
  const { data, isLoading, refetch, dataUpdatedAt } = useGetFormulas();
  const columnHelper = createColumnHelper();
  const { keycloak } = useKeycloak();
  const [selected, setSelected] = React.useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: addIsOpen, onOpen: addOnOpen, onClose: addOnClose } = useDisclosure();

  const hasAdminRole = keycloak.hasRealmRole("admin");

  const columns = useMemo(() => [
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
            <Button onClick={() => {
              setSelected(cell.row.original);
              onOpen();
            }
            }><MdOutlineModeEditOutline /></Button>
            <DeleteModal formula={cell.row.original} />
          </Flex>
        )
      )
    })
  ], []);

  return (
    <Box h={"100%"} overflowY={"auto"}>
      <Box p={3} pt={1} h={"100%"}>
      {(isOpen && hasAdminRole) &&
        <EditDialog form={selected?.formula} formulaId={selected?.id} isOpen={isOpen} onClose={onClose}
                    onOpen={onOpen} />}
      <Flex justifyContent={"flex-end"} maxH={"7%"} h={"7%"} pr={3} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            borderWidth={1}
            borderRadius={"5px"}
            alignItems={"center"}>
        <Button size={{ base: "sm", md: "md" }} disabled={isLoading || !data} onClick={refetch} mr={3}>
          <FiRefreshCcw />
          <Text ml={2}>Refresh</Text>
        </Button>
        {hasAdminRole && (<Button size={{ base: "sm", md: "md" }}
                                  leftIcon={<AddIcon />} c
                                  colorScheme="teal"
                                  variant="solid"
                                  onClick={addOnOpen}
        >
          Add
        </Button>)}
        {(addIsOpen && hasAdminRole) &&
          <EditDialog isOpen={addIsOpen} onClose={addOnClose} onOpen={addOnOpen} isNew={true} />}
      </Flex>
      {data && <TableListView data={data.data} columns={columns} updatedAt={dataUpdatedAt} />}
      </Box>
    </Box>
  );
}

export default FormulaEditor;
