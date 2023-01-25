import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  StackDivider,
  IconButton,
  Spinner,
  Link,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Tooltip, useColorModeValue
} from "@chakra-ui/react";
import { InfoOutlineIcon, SettingsIcon } from "@chakra-ui/icons";
import axios from "axios";
import { getBaseURL } from "../helpers/api.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useKeycloak } from "@react-keycloak/web";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const schema = yup.object({
  DEFAULT_MAIL: yup.string().email().required(),
  MAIL_FREQUENCY: yup.number().positive().integer().max(60).required()
}).required();

const getMetaSettings = async (token) => {
  return await axios.get(`${getBaseURL()}/api/meta-settings`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const useGetMetaSettings = () => {
  const { keycloak } = useKeycloak();
  return useQuery({
    queryKey: ["meta-settings"],
    queryFn: () => getMetaSettings(keycloak.token)
  });
};

const EditSettingsModal = ({ mail, frequency }) => {
  const { keycloak } = useKeycloak();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      DEFAULT_MAIL: mail,
      MAIL_FREQUENCY: frequency
    },
    resolver: yupResolver(schema)
  });

  const { mutate } = useMutation(
    async (data) => {
      return await axios.put(`${getBaseURL()}/api/meta-settings`, data, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["meta-settings"]);
        toast({
          title: "Settings updated.",
          status: "success",
          position: "bottom-right",
          duration: 5000,
          isClosable: true
        });
        onClose();
      }
    }
  );
  return (
    <>
      <IconButton size={{ base: "sm", md: "md" }} icon={<SettingsIcon />} onClick={onOpen}
                  aria-label={"changeBackendSettings"} />
      <Modal isCentered={true} isOpen={isOpen} onClose={() => {
        reset();
        onClose();
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
              <Flex gap={5} flexDir={"column"}>
                <FormControl isInvalid={errors.DEFAULT_MAIL}>
                  <FormLabel htmlFor={"DEFAULT_MAIL"}>{"Notification Address"}</FormLabel>
                  <Input
                    {...register("DEFAULT_MAIL")}
                  />
                  <FormErrorMessage>{errors.DEFAULT_MAIL?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.MAIL_FREQUENCY}>
                  <FormLabel htmlFor={"MAIL_FREQUENCY"}>{"Mail Frequency"}</FormLabel>
                  <Input type={"number"}
                         {...register("MAIL_FREQUENCY")}
                  />
                  <FormErrorMessage>{errors.MAIL_FREQUENCY?.message}</FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit">
                  Save
                </Button>
              </Flex>
            </form>
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const SettingsPage = () => {
  const { keycloak } = useKeycloak();
  const { data, isLoading } = useGetMetaSettings();
  const cardBg = useColorModeValue("#fff", "#202023");

  return (
    <Box p={3} pt={1} h={"100%"}>
      <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
        <Card boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} variant={"outline"} bg={cardBg}>
          <CardHeader display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Heading size="md">Backend Settings</Heading>
          </CardHeader>

          {isLoading && <CardBody>
            <Spinner />
          </CardBody>}
          {data && <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Flex gap={2}>
                  <Tooltip label={"The default notification address where all alerts are sent to."} placement={"top"}>
                    <InfoOutlineIcon />
                  </Tooltip>
                  <Heading size="xs">
                    Default Notification Address
                  </Heading>
                </Flex>
                <Text pt="2" fontSize="sm">
                  {data?.data.DEFAULT_MAIL}
                </Text>
              </Box>
              <Box>
                <Flex gap={2}>
                  <Tooltip
                    label={"Frequency of when mails are sent out per variable that passed its threshold, even if the variable surpasses the threshold multiple times in that time window."}
                    placement={"top"}>
                    <InfoOutlineIcon />
                  </Tooltip>
                  <Heading size="xs">
                    Mail Frequency
                  </Heading>
                </Flex>
                <Text pt="2" fontSize="sm">
                  {data?.data.MAIL_FREQUENCY}min
                </Text>
              </Box>
              {/*
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  History Data Sampling Rate
                </Heading>
                <Text pt="2" fontSize="sm">
                  100%
                </Text>
              </Box>
              */}
            </Stack>
          </CardBody>}
          <CardFooter justifyContent={"flex-end"}>
            {(keycloak.hasRealmRole("master") && data?.data) &&
              <EditSettingsModal frequency={data?.data?.MAIL_FREQUENCY} mail={data?.data?.DEFAULT_MAIL} />}
          </CardFooter>
        </Card>
        <Card boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} variant={"outline"} bg={cardBg}>
          <CardHeader>
            <Heading size="md"> Keycloak Admin Panel</Heading>
          </CardHeader>
          <CardBody>
            <Text>Check out the Keycloak Admin Panel to manage users</Text>
          </CardBody>
          <CardFooter justifyContent={"flex-end"}>
            <Link target="_blank" href={`${keycloak.authServerUrl}`}>
              <Button>Open</Button>
            </Link>
          </CardFooter>
        </Card>

      </SimpleGrid>
    </Box>
  );
};

export default SettingsPage;