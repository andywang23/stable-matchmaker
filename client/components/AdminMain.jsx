import React from 'react';

import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';

const AdminMain = (props) => {
  const { userName } = props;
  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState(['andy', 'bob']);
  const [groupName, setGroupName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [groupStatus, setGroupStatus] = useState('');

  useEffect(() => {
    async function getGroups() {
      const response = await fetch(`/api/groups/${userName}`);
      const parsedRes = await response.json();
      setGroups(parsedRes);
    }
    getGroups();
  }, []);

  //should refactor to custom hook?
  function handleSubmitPerson(e) {
    e.preventDefault();
    let newPerson = document.querySelector('#personName').value;
    setPeople(people.concat([newPerson]));
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

  async function handleSelectChange(e) {
    console.log('in handle select');

    const response = await fetch(`/api/groupstatus/${e.target.value}`);
    const parsedRes = await response.json();
    setGroupStatus(parsedRes.status);

    console.log(parsedRes);
  }

  return (
    <div>
      Hello, {userName}
      <br />
      See Group Status
      <br />
      <select name="groups" id="groupSelector" onChange={handleSelectChange}>
        <option value="">Choose Available Groups</option>
        {groups.map((group) => (
          <option value={group}>{group}</option>
        ))}
      </select>
      <br />
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
