import React from 'react';
import { useState, useRef } from 'react';
import GroupStatus from './GroupStatus';
import styled from 'styled-components';
import { Container, Form, Button, CenterFlex } from '../styles/styledComponents';

const AdminDashboard = styled(Container)`
  margin-top: 5em;
  height: fit-content;
  min-height: 300px;
`;

const InputForm = styled(Form)`
  height: 27px;
  margin-bottom: 1.3em;
`;

const SubmitGroupButton = styled(Button)`
  margin-top: 1em;
`;

const AdminMain = ({ userName }) => {
  const [people, setPeople] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupSubmitRes, setGroupSubmitRes] = useState('');
  const personNameInput = useRef(null);

  //TO DO: need to account for duplicate names and spaces!
  function handleSubmitPerson(e) {
    e.preventDefault();
    const newPerson = personNameInput.current.value;
    setPeople((oldPeople) => [...oldPeople, newPerson]);
    personNameInput.current.value = '';
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
        <CenterFlex>
          <center>
            <label htmlFor="groupName">Group Name</label>
          </center>
          <InputForm name="groupName" onChange={handleGroupNameChange}></InputForm>
          <br />
          <form onSubmit={handleSubmitPerson}>
            <center>
              <label htmlFor="personName">Input Individual Names (Enter to Add)</label>
            </center>
            <InputForm name="personName" ref={(node) => (personNameInput.current = node)} />
          </form>
        </CenterFlex>

        <CenterFlex>
          People Added (Click to Delete)
          {people.map((person, idx) => (
            <li key={idx} onClick={handleDeleteGroupMember}>
              {person}
            </li>
          ))}
          <SubmitGroupButton onClick={handleSubmitGroup}>Submit Full Group</SubmitGroupButton>
          <div>{groupSubmitRes}</div>
        </CenterFlex>
      </AdminDashboard>
    </>
  );
};

export default AdminMain;
