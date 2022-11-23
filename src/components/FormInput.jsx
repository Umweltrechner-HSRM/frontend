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
} from "@chakra-ui/react";
import React, { useState } from "react";

function InputField({sensors, completeInput, setCompleteInput}){

  const [lastSelected, setSelected] = useState()
  const [displaySelected, setDisplay] = useState()

  const initialFocusRef = React.useRef();
  const {isOpen, onToggle, onClose} = useDisclosure();
  
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

            value={completeInput}
            onChange={(e)=>{setCompleteInput(e.target.value)}}
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
  let tmp = input.split(' ')

  sensors.map(item => {valid.push(item.name)})

  tmp.map((element, index) => {
    if(valid.includes(element) && !res.includes(element)){
      res.push(element)
    }
  });

  return res


}


function DataTable({completeInput, sensors}){

  let allWords = getValidWords(completeInput, sensors)

  return(
    <TableContainer
      variant='simple'
      type='inherit'
    >
      <Table>
        <Tbody>
          {allWords.map((item,index)=>{
            return(
              <Tr
                key={index}
              >
                <Td>{item}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

function FormInput({sensors}){

  const [completeInput, setCompleteInput] = useState('')


  return(
    <Box>
      <InputField sensors={sensors} completeInput={completeInput} setCompleteInput={setCompleteInput} />
      <DataTable completeInput={completeInput} sensors={sensors} />
    </Box>
  );
}

export default FormInput