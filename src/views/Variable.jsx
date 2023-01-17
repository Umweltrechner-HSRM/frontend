import React, { useMemo } from "react";
import {
  Box,
  Button,
  Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input, useToast, Textarea,
} from "@chakra-ui/react";
import "../styles/styles.css";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
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
import { useForm } from 'react-hook-form'

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

const addThresholds = async (token, data) => {
  return await axios.put(`${getBaseURL()}/api/variable/${data.name}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
};

const EditDialog = ({ isOpen, onOpen, onClose, data }) => {
  const { register, handleSubmit} = useForm({
    defaultValues: {
      name: data.name,
      minThreshold: '',
      maxThreshold: '',
      emailList: ''
    }});
  const queryClient = useQueryClient();
  const toast = useToast();
  const {keycloak} = useKeycloak();

  const { mutate } = useMutation({
    mutationKey: ["addThresholds"],
    mutationFn: (data) => addThresholds(keycloak.token, Object.assign(data,{
      emailList: data.emailList?.split('\n')
    })),
    onSuccess: () => {
      queryClient.invalidateQueries(["formulas"]);
      onClose();
      toast({
        position: "bottom-right",
        title: "Thresholds added.",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        position: "bottom-right",
        title: "Error adding thresholds.",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  });
  const onFormSubmit = (data) => {
    mutate(data);
  }

  return (
    <>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editing Variable "{data?.name}"</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalBody>
            <FormControl>
              <FormLabel>Min Threshold</FormLabel>
              <Input type='number' step="0.01" name="Min Threshold" {...register('minThreshold')} />
            </FormControl>
            <FormControl>
              <FormLabel>Max Threshold</FormLabel>
              <Input type='number' step="0.01" name="Max Threshold" {...register('maxThreshold')} />
            </FormControl>
            <FormControl>
              <FormLabel>Mail</FormLabel>
              <Textarea placeholder="One email address per line" name="mail" {...register("emailList")}/>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type={'submit'}>Save</Button>
          </ModalFooter>
          </form>
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
