import {React} from 'react';

export let userData = []; //container for data, list of Users

//gives access to data
export function getUsers(){
    add_user("Peter", "w3cxm", "admin", "Peter@mail", "06122123456");
    return userData;
} 

function add_user(new_name, new_password, new_rank, new_mail, new_number){
    userData.push({
        name: new_name,     //check name length, characters etc.
        password: new_password,  //hashing later when security
        rank: new_rank,  //user, admin, owner
        mail: new_mail, //mail and number for alerts later
        number: new_number //phone Number
    })
}


function AddUser() {
    var users = getUsers();
    return (
        <div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
            Add Users <br/>
            {users[0].name} <br/>
            {users[0].password} <br/>
            {users[0].rank} <br/>
            {users[0].mail} <br/>
            {users[0].number} <br/>
        </div>
    );
}


export default AddUser;
