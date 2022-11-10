import React from 'react';
import { add_example_user, userData } from './AddUser';

var userList = userData

function UserList() {
    return (
        <div>
            <br/><br/><br/><br/><br/>
            Test <br/>
            {userList[0].name}
        </div>
    );
}

export default UserList;  
