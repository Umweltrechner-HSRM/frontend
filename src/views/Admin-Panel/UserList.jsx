import React from 'react';
import { getUsers} from './AddUser';

function UserList() {

    const users = getUsers();

    return (
        <div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
            List of Users <br/>
            {users[0].name} <br/>
            {users[0].password} <br/>
            {users[0].rank} <br/>
            {users[0].mail} <br/>
            {users[0].number} <br/>
        </div>
    );
}

export default UserList;  
