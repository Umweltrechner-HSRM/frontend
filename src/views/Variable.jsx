import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input, useToast, HStack, useColorModeValue, Text
} from '@chakra-ui/react';
import '../styles/styles.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getBaseURL } from '../helpers/api.jsx';
import {
  MdOutlineModeEditOutline
} from 'react-icons/md';
import { useKeycloak } from '@react-keycloak/web';
import {
  createColumnHelper
} from '@tanstack/react-table';
import { TableListView } from '../components/TableListView.jsx';
import { useFieldArray, useForm } from 'react-hook-form';
import {FiRefreshCcw} from "react-icons/fi";


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
    queryKey: ['variables'],
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

  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: data.name,
      minThreshold: data.minThreshold,
      maxThreshold: data.maxThreshold,
      emailList: data.customerAlertList
    }
  });

const {fields, remove, append} = useFieldArray(
      {
        control,
        name: 'emailList'
      });
  const watchThresholds = watch("minThreshold")!=='' && watch("maxThreshold")!=='' && Number(watch("minThreshold")) > Number(watch("maxThreshold"));

  const queryClient = useQueryClient();
  const toast = useToast();
  const { keycloak } = useKeycloak();

  const { mutate } = useMutation({
    mutationKey: ['addThresholds'],
    mutationFn: (data) => addThresholds(keycloak.token, Object.assign(data, {
      emailList: data.emailList.map((item) => item.email)
    })),
    onSuccess: () => {
      queryClient.invalidateQueries(['variables']);
      onClose();
      toast({
        position: 'bottom-right',
        title: 'Thresholds added.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        position: 'bottom-right',
        title: 'Error adding thresholds.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });
  const onFormSubmit = (data) => {
    mutate(data);
  };

  return (
    <>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editing Variable "{data?.name}"</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <ModalBody>
              <FormControl isInvalid={watchThresholds[0] > watchThresholds[1]}>
                <FormLabel>Min Threshold</FormLabel>
                <Input borderColor={useColorModeValue('gray.400', 'gray.600')}
                       borderWidth={'2px'} bg={useColorModeValue('white', 'gray.800')}
                       type='number' step='0.01' name='Min Threshold' {...register('minThreshold')} />
                <FormErrorMessage>Min Thresholds is higher than Max Threshold.</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={watchThresholds[0] > watchThresholds[1]}>
                <FormLabel>Max Threshold</FormLabel>
                <Input
                  borderColor={useColorModeValue('gray.400', 'gray.600')}
                  borderWidth={'2px'} bg={useColorModeValue('white', 'gray.800')} type='number' step='0.01'
                  name='Max Threshold' {...register('maxThreshold')} />
                <FormErrorMessage>Max Thresholds is lower than Min Threshold.</FormErrorMessage>
              </FormControl>
              <ul>
                {fields.map((item, index) => {
                  return (
                    <div key={item.id}>
                      <FormLabel>Mail</FormLabel>
                      <HStack>
                        <Input
                          borderColor={useColorModeValue('gray.400', 'gray.600')}
                          borderWidth={'2px'} bg={useColorModeValue('white', 'gray.800')}
                          type={'email'}
                          key={item.id}
                          name={`emailList[${index}]`}
                          defaultValue={''}
                          {...register(`emailList.${index}.email`)}
                        />
                        <Button type='button' onClick={() => remove(index)}>
                          Delete
                        </Button>
                      </HStack>
                    </div>
                  );
                })}
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => {
                append({ email: '' });
              }}>
                Add E-Mail
              </Button>
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
  const { data, isLoading, error, refetch, dataUpdatedAt } = useGetVariables();
  const [selected, setSelected] = React.useState(null);
  const columnHelper = createColumnHelper();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { keycloak } = useKeycloak();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('minThreshold', {
      header: 'Min Threshold',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('maxThreshold', {
      header: 'Max Threshold',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: info => info.getValue() && info.getValue().toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    }),
    columnHelper.accessor('lastOverThreshold', {
      header: 'Last Over Threshold',
      cell: info =>
        info.getValue() && `${new Date(info.getValue()).toLocaleString()}`
    }),
    columnHelper.accessor('action', {
      header: 'Actions',
      enableSorting: false,
      cell: ({ cell }) => (
        keycloak.hasRealmRole('admin') && (
          <Flex justifyContent={'center'} gap={2}>
            <Button onClick={() => {
              setSelected(cell.row.original);
              onOpen();
            }
            }><MdOutlineModeEditOutline /></Button>
          </Flex>
        )
      )
    })
  ], []);

  return (
    <Box h={'100%'} overflowY={'auto'}>
      <Box p={3} pt={1} h={'100%'}>
        <Flex justifyContent={'flex-end'} maxH={'7%'} h={'7%'} pr={3} boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
              borderWidth={1}
              borderRadius={'5px'}
              alignItems={'center'}>
          <Button size={{ base: "sm", md: "md" }}
                  disabled={isLoading || !data} onClick={refetch} mr={3}
                  isLoading={isLoading}
          >
            <FiRefreshCcw />
            <Text ml={2}>Refresh</Text>
          </Button>
        </Flex>
        {isOpen && <EditDialog data={selected} isOpen={isOpen} onClose={onClose} onOpen={onOpen} />}
        {data && <TableListView data={data.data} columns={columns} refetch={refetch} updatedAt={dataUpdatedAt}
                                loading={isLoading} />}
      </Box>
    </Box>
  );
}

export default VariablePage;
