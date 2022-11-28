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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { circularProgressAnatomy } from "@chakra-ui/anatomy";

let client = null;
let connected = false;
let connectedWords = []

function InputField({sensors, setDisplayValue}){

  const [lastSelected, setSelected] = useState()
  const [displaySelected, setDisplay] = useState()

  const initialFocusRef = React.useRef()
  const {isOpen, onToggle, onClose} = useDisclosure()

  let validWords = []
  

  function onChangeHandler(e){
    let input = e.target.value
    validWords = getValidWords(input, sensors)
    disconnectWords(validWords)
    connectWords(validWords, setDisplayValue)
  }

  function onBlurHandler(e){
    if(isOpen){
      onToggle();
      setDisplay(lastSelected);
      console.log(lastSelected)
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

function getValidWords(input, sensors){
  let res =[]
  let valid =[]
  let inArray = input.split(' ')
  
  inArray.map((item, index) => {
    inArray[index] = item.toLowerCase()
  })

  sensors.map(item => {
    valid.push(item)
  })


  //TODO change order of elements in res from order of valid to order of inArray
  valid.map(element => {
    if(inArray.includes(element.name.toLowerCase())){
      res.push(element)
    }
  })


  return res


}

function disconnectWords(allWords){
  let res = []
  let allNames = []
  allWords.forEach(item => allNames.push(item.name))

  connectedWords.forEach(item => {
    if(!allNames.includes(item.name)){
      item.id.unsubscribe()
      console.log("Disconnected",item.name)
    }else{
      res.push(item)
    }
  })

  connectedWords = res

}

function connectWords(allWords, setDisplayValue){

  let connectedNames = []
  connectedWords.map(item => connectedNames.push(item.name))
  
  allWords.map((word, wordIndex) =>{
    if(!connectedNames.includes(word.name)){
      let subID = client.subscribe(word.link, (msg) =>{
        let msgJson = JSON.parse(msg.body)
        let returnMsg = {name:word.name, value:msgJson.value, unit:'TODO', timestamp:msgJson.timestamp}
        
        setDisplayValue((curr) => {
          if(curr.length <= wordIndex){
            return [...curr, returnMsg]
          }else{
            return curr.map((element, elemIndex) => {
              if(elemIndex == wordIndex){
                return returnMsg
              }else{
                return element
              }
            })
          }
        })
        


        //console.log(msgArray)
      })
      connectedWords.push({name:word.name, id:subID})
      console.log("Connected", word.name)
    }
  })
}

let msgArray = []
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
          {displayValue.map((item,index)=>{
            let elems = Object.values(item)
            return(
              <Tr key={index}>
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


function connectToClient(){
  useEffect(() => {
    client = new Client({
      brokerURL: "ws://localhost:8230/api/looping",
      onConnect: () =>{
        console.log("FormInput connected");
      }
    });
    client.activate();
    return() => {
      console.log("Disconnected from FormInput");
      client.deactivate();
      connected = false;
    }
  }, []);
}


function FormInput({sensors}){
  const [displayValue, setDisplayValue] = useState([])
  connectToClient();

  return(
    <Box>
      <InputField sensors={sensors} setDisplayValue={setDisplayValue} />
      <DataTable sensors={sensors} displayValue={displayValue} />
    </Box>
  );
}

export default FormInput