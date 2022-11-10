import {React} from 'react';
import {FormControl, FormLabel, FormHelperText, Input, Stack, InputGroup, InputLeftAddon} from '@chakra-ui/react'

//Problem: data gets deleted on server restart, no object where to write something in

export var userData = [{
    name: "Max Mustermann",
    password: "123",
    mail: "Max@Mustermann-webmail.de",
    number: "4133"
}]; //container for data, list of Users

function add_user(new_name, new_password, new_mail, new_number){
    userData.push({
        name: new_name,     //check name length, characters etc.
        password: new_password,  //hashing later when security
        mail: new_mail, //mail and number for alerts later
        number: new_number //phone Number
    })
    console.log(userData[1]);
}

export function add_example_user(){
    add_user("Max Mustermann", "12345", "Max@Mustermann-webmail.de", "012345");
    console.log(userData[0].name);
}

let name = "";
let password = "";
let mail = "";
let number = 0;

function AddUser() {
    return (
        <div>
            <br/><br/><br/><br/><br/>
            <FormControl isRequired>
            <Stack spacing={4}>
                <InputGroup>
                    <InputLeftAddon children="Name:" id="name"/>
                    <Input type="text" placeholder='Max Mustermann' onChange={e => name = e.target.value}/>
                </InputGroup>
                <InputGroup>
                    <InputLeftAddon children="Password:" id="password"/>
                    <Input type="password" placeholder='******' onChange={e => password = e.target.value}/>
                </InputGroup>
                <InputGroup>
                    <InputLeftAddon children="Mail:" id="mail"/>
                    <Input type="email" placeholder='Max@Mustermann-webmail.de' onChange={e => mail = e.target.value}/>
                </InputGroup>
                <InputGroup>
                    <InputLeftAddon children="Phone Number:" id="number"/>
                    <Input type="number" placeholder='0612255555' onChange={e => number = e.target.value}/>
                </InputGroup>

                <button type="submit" onClick={e => add_user(name, password, mail, number)}>Create Account</button>
            </Stack>
            </FormControl>
        </div>
    );
}


export default AddUser;
