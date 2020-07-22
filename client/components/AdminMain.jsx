import React from 'react';

import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';
import GroupStatus from './GroupStatus';

const AdminMain = (props) => {
  const { userName } = props;
  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState(['andy', 'bob']);
  const [groupName, setGroupName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [groupStatus, setGroupStatus] = useState('');

  //should refactor to custom hook?
  //TO DO: need to account for duplicate names and spaces!
  function handleSubmitPerson(e) {
    e.preventDefault();
    const textForm = document.querySelector('#personName');
    let newPerson = textForm.value;
    setPeople(people.concat([newPerson]));
    textForm.value = '';
  }

  async function handleSubmitGroup(e) {
    e.preventDefault();
    if (people.length % 2) return setErrorMsg('Need even number of people');
    const body = { admin: userName, groupName: groupName, names: people };
    //need to make post request to server with admin, group name, and people list
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsedRes = await response.json();
  }

  function handleGroupNameChange(e) {
    setGroupName(e.target.value);
  }

  return (
    <div>
      Hello, {userName}
      <br />
      <GroupStatus userName={userName} />
      Create Group
      <br />
      <label htmlFor="groupName">Group Name</label>
      <input
        id="groupName"
        name="groupName"
        onChange={handleGroupNameChange}
      ></input>
      <br />
      <form onSubmit={handleSubmitPerson}>
        <label htmlFor="personName">Input People Names</label>
        <input id="personName" name="personName"></input>
      </form>
      <div>
        People Added:
        <br />
        {people.map((person) => (
          <li>{person}</li>
        ))}
      </div>
      <button onClick={handleSubmitGroup}>Submit</button>
    </div>
  );
};

export default AdminMain;
