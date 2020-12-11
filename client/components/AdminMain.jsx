import React from 'react';
import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import GroupStatus from './GroupStatus';
import styled from 'styled-components';
import { Container, Form, Button, CenterFlex } from '../styles/styledComponents';

const AdminDashboard = styled(Container)`
  margin-top: 5em;
  height: fit-content;
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
  const handleSubmitPerson = (e) => {
    e.preventDefault();
    const newPerson = personNameInput.current.value;
    setPeople((prevPeopleArr) => [...prevPeopleArr, newPerson]);
    personNameInput.current.value = '';
  };

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    if (people.length % 2) return setGroupSubmitRes('Need even number of people');
    const body = { admin: userName, groupName: groupName, names: people };

    try {
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
    } catch {
      setGroupSubmitRes('Network Error');
    }
  };

  const handleGroupNameChange = (e) => setGroupName(e.target.value);

  const handleDeleteGroupMember = (e) => {
    const newPeople = people.filter((person) => person !== e.target.innerText);
    setPeople(newPeople);
  };

  return (
    <>
      <AdminDashboard style={{ minHeight: '355px' }}>
        <h3>Hello, {userName}</h3>
        <div>
          <GroupStatus userName={userName} />
        </div>
      </AdminDashboard>

      <AdminDashboard>
        <h4>Create Group</h4>
        <CenterFlex>
          <label htmlFor="groupName">Group Name</label>

          <InputForm name="groupName" onChange={handleGroupNameChange}></InputForm>

          <form onSubmit={handleSubmitPerson} style={{ marginTop: '1em' }}>
            <CenterFlex>
              <label htmlFor="personName">Input Individual Names (Enter to Add)</label>
            </CenterFlex>
            <InputForm name="personName" ref={(node) => (personNameInput.current = node)} />
          </form>
        </CenterFlex>

        <CenterFlex>
          People Added (Click to Delete)
          <ul style={{ margin: 0 }}>
            {people.map((person) => (
              <li key={uuid()} onClick={handleDeleteGroupMember} style={{ margin: 0 }}>
                {person}
              </li>
            ))}
          </ul>
          <SubmitGroupButton onClick={handleSubmitGroup}>Submit Full Group</SubmitGroupButton>
          <div>{groupSubmitRes}</div>
        </CenterFlex>
      </AdminDashboard>
    </>
  );
};

export default AdminMain;
