import React from 'react';
import { useState } from 'react';
import GroupStatus from './GroupStatus';
import styled from 'styled-components';
import { Container } from '../styles/sharedstyles';

const AdminDashboard = styled(Container)`
  margin-top: 5em;
  height: fit-content;
  min-height: 300px;
`;

const AdminMain = (props) => {
  const { userName } = props;
  const [people, setPeople] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupSubmitRes, setGroupSubmitRes] = useState('');

  //TO DO: need to account for duplicate names and spaces!
  function handleSubmitPerson(e) {
    e.preventDefault();
    const textForm = document.querySelector('#personName');
    let newPeople = people.concat([textForm.value]);
    setPeople(newPeople);
    textForm.value = '';
  }

  async function handleSubmitGroup(e) {
    e.preventDefault();
    if (people.length % 2) return setGroupSubmitRes('Need even number of people');
    const body = { admin: userName, groupName: groupName, names: people };

    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsedRes = await response.json();

    if (parsedRes && parsedRes.err) setGroupSubmitRes('Group name already exists!');
    else setGroupSubmitRes('Sucessfully added group!');
  }

  function handleGroupNameChange(e) {
    setGroupName(e.target.value);
  }

  function handleDeleteGroupMember(e) {
    e.target.remove();
    const newPeople = people.filter((person) => person !== e.target.value);
    setPeople(newPeople);
  }

  return (
    <>
      <AdminDashboard>
        <h3>Hello, {userName}</h3>
        <div>
          <GroupStatus userName={userName} />
        </div>
      </AdminDashboard>

      <AdminDashboard>
        <h4>Create Group</h4>
        <div className="group-creator-container">
          <center>
            <label htmlFor="groupName">Group Name</label>
          </center>
          <input id="groupName" name="groupName" onChange={handleGroupNameChange}></input>
          <br />
          <form onSubmit={handleSubmitPerson}>
            <center>
              <label htmlFor="personName">Input Individual Names (Enter to Add)</label>
            </center>
            <input id="personName" name="personName"></input>
          </form>
        </div>

        <div className="group-status-container">
          People Added (Click to Delete)
          <br />
          <br />
          {people.map((person, idx) => (
            <li key={idx} onClick={handleDeleteGroupMember}>
              {person}
            </li>
          ))}
          <button id="submit-group-btn" onClick={handleSubmitGroup}>
            Submit Full Group
          </button>
          <div className="group-submit-msg">{groupSubmitRes}</div>
        </div>
      </AdminDashboard>
    </>
  );
};

export default AdminMain;
