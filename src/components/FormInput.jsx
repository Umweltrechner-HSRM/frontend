import { 
  Box, 
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Flex,
  useDisclosure,
  List,
  ListItem,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  useComponentStyles__unstable,
  Thead,
  Th,
  filter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import ValidationButtons from "./ValidationButtons.jsx"

let client = null;
//Müsste State sein für runtime Updates
let connectedMessages = []

function connectToClient(sensors){
  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
        console.log("FormInput connected");
        connectSensors(sensors)
      }
    });
    client.activate();
    return() => {
      console.log("Disconnected from FormInput");
      client.deactivate();
    }
  }, []);
}

function connectSensors(sensors){
  //console.log("sensors:",sensors)
  sensors.forEach((sensor, index) =>{
    client.subscribe(sensor.link,(msg) =>{
      let msgJson = JSON.parse(msg.body)
      let returnMsg = {name:sensor.name, value:msgJson.value, unit:'TODO', timestamp:msgJson.timestamp}
      if(index >= connectedMessages.length){
        connectedMessages.push(returnMsg)
      }else{
        connectedMessages[index] = returnMsg
      }
    })
  })
}

function getValidWords(input, sensors){
  let res =[]
  let inArray = input.split(/(?:\n| )+/)
  let valid = sensors.map(sen => sen.name.toLowerCase())

  //console.log("sensors:",sensors)
  //console.log("valid:", valid)
  //console.log("inArray:",inArray)

  inArray.forEach(inItem => {
    if(valid.includes(inItem.toLowerCase())){
      res.push(inItem)
    }
    /*let index = -1
    index = valid.indexOf(inItem.toLowerCase())
    if(index > -1){
      res.push(sensors[index])
    }*/
  })
  //console.log("res:",res)
  return res
}

function InputField({sensors, setDisplayValue, setSensorData, setInputValue}){

  const [lastSelected, setSelected] = useState()
  const [displaySelected, setDisplay] = useState()

  const initialFocusRef = React.useRef()
  const {isOpen, onToggle, onClose} = useDisclosure()

  let validWords = []
  
  function onChangeHandler(e){
    let input = e.target.value
    setInputValue(input)
    validWords = getValidWords(input, sensors)
    //console.log("validWords:",validWords)
    //TODO change this to after form validation
    setSensorData(validWords)
    //end of TODO
    //console.log("connectedMessages:",connectedMessages)
    setDisplayValue((curr) =>{
      let res = []
      let msgNames = connectedMessages.map(msg => msg.name.toLowerCase())
      validWords.forEach(val => {
        //console.log("val:",val)
        let index = msgNames.indexOf(val.toLowerCase())
        if (index > -1){
          res.push(connectedMessages[index])
        }
        
      })

      return res

    })




  }

  function onBlurHandler(e){
    if(isOpen){
      onToggle();
      setDisplay(lastSelected);
      //console.log(lastSelected)
    }
  }
  function onClickHandler(e){
    if(isOpen === false){
      onToggle();
    }
  }

  return(
    <Box w='501.41px'>
      <Popover
        initialFocusRef={initialFocusRef}
        placement='bottom'
        matchWidth={true}
        trigger='click'
        colorScheme='inherit'
        preventOverflow={false}
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        closeOnBlur={false}
        closeOnEsc={true}
      >
        <PopoverTrigger>
          <Textarea 
            resize='none' 
            placeholder="Formel" 
            ref={initialFocusRef}
            onBlur={onBlurHandler}
            //onClick={onClickHandler}
            onChange={onChangeHandler}
          />
        </PopoverTrigger>
        <PopoverContent 
          bg='inherit'
          borderWidth='0px'
        >
          <PopoverBody>
            <ButtonList sensors={sensors} setSelected={setSelected} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

function ButtonList({sensors,setSelected}){
  
  function mouseEnterHandler(e){
    //console.log('entered');
    setSelected(e.target.innerText);
  }
  function mouseLeaveHandler(){
    //console.log('left')
    setSelected('');
  }

  return(
    <Flex
      align='flex-start'
      direction='column'
    >
      <List>
        {sensors.map((item,index)=>{
          return(
            <ListItem
            _hover={{bg: "#AEC8CA"}}
            w='110%'
            key={index}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
            >
              {item.name}
            </ListItem>
          )
        })}
      </List>
    </Flex>   
  )
}

function DataTable({displayValue}){

  return(
    <TableContainer
      variant='simple'
      type='inherit'
      w='501.41px'
    >
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Latest Value</Th>
            <Th>Unit</Th>
            <Th>Timestamp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayValue.map((item,dIndex)=>{
            let elems = Object.values(item)
            return(
              <Tr key={dIndex}>
                {elems.map((elem, index) => {
                  return(
                    <Td key={index}>{elem}</Td>
                  )
                })}
              </Tr>
            )            
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

function FormInput({sensors, setSensorData}){
  const [displayValue, setDisplayValue] = useState([])
  const [inputValue, setInputValue] = useState([])
  connectToClient(sensors);

  return(
    <Box>
      <InputField sensors={sensors} setDisplayValue={setDisplayValue} setSensorData={setSensorData} setInputValue={setInputValue} />
      <ValidationButtons form={inputValue} />
      <DataTable sensors={sensors} displayValue={displayValue} />
    </Box>
  );
}

export default FormInput