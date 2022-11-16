import { 
  Box, 
  Text, 
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  VStack,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import {createPopper} from '@popperjs/core'
import React from "react";

function InputField({sensors}){
  
  const initialFocusRef = React.useRef();
  const {isOpen, onToggle, onClose} = useDisclosure();
  
  function onBlurHandler(e){
    if(isOpen){
      onToggle();
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
            onClick={onClickHandler}
          />
        </PopoverTrigger>
        <PopoverContent 
          bg='inherit'
          borderWidth='0px'
        >
          <PopoverBody>
            <ButtonList sensors={sensors} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}


function ButtonList({sensors}){
  return(
    <Flex
      align='flex-start'
      direction='column'

    >
      {sensors.map((item , index) => {
        return(
          <Box
            key={index}
            w='50%'
            _hover={{backgroundColor: "#AEC8CA" }}
          >

            <Button 
              
              variant='unstyled' 
              justifyContent='flex-start'
              
            >
              {item.name}</Button>
        </Box>
    
        )
      })}
    </Flex>
    
  )
}

function FormInput({sensors}){
  return(
    <Box>
      <InputField sensors={sensors} />
    </Box>
  );
}

export default FormInput