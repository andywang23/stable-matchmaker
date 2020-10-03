import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container,
  Form,
  CenterFlex,
  Select,
  Button,
  TableCell,
  TableHead,
  Table,
} from '../styles/styledComponents';

const UserLanding = () => {
  //input form for groupID
  //drop down to choose which user you are
  //drag and drop preference selector

  const [groupVerified, setGroupVerified] = useState(null);
  const [groupStatus, setGroupStatus] = useState(null);
  const [userName, setUserName] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const groupIDForm = useRef(null);

  async function verifyGroup(e) {
    e.preventDefault();
    const candidateGroupID = groupIDForm.current.value;
    try {
      const response = await fetch(`/api/groupname/${candidateGroupID}`);
      const parsedRes = await response.json();
      if (!parsedRes.groupName) setGroupVerified(false);
      else {
        setGroupVerified(true);
        setGroupStatus(parsedRes);
      }
    } catch {
      setErrorMsg('Error: Could not fetch group from server');
    }
  }

  function generateResultInfo() {
    const resultTable = groupStatus.results;
    const resultTableRows = [];
    for (const person in resultTable) {
      resultTableRows.push(
        <tr>
          <TableCell>{person}</TableCell>
          <TableCell>{resultTable[person]}</TableCell>
        </tr>
      );
    }
    return (
      <div className="results">
        <Table>
          <TableHead>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell colSpan="1000">Preferences</TableCell>
            </tr>
          </TableHead>
          {resultTableRows}
        </Table>
      </div>
    );
  }

  function groupVerificationMsg() {
    if (groupVerified === false) return <div>Incorrect Group ID</div>;
    else if (groupStatus && groupStatus.status === 'results') {
      return (
        <div className="group-verified-msg">
          Results released!
          {generateResultInfo()}
        </div>
      );
    } else if (groupStatus && groupStatus.status === 'missing') {
      return (
        <CenterFlex>
          <div>
            <strong>Group "{groupStatus.groupName}" verified - pending results!</strong>
          </div>
          <br />
          If you have not yet sent in your preferences - please select your name below.
          <Select
            name="names"
            style={{ marginTop: '1em' }}
            onChange={(e) => setUserName(e.target.value)}
          >
            <option value="">Choose Your Name</option>
            {groupStatus.missing.map((name, idx) => (
              <option value={name} key={idx}>
                {name}
              </option>
            ))}
          </Select>
          <br />
          <NavLink
            to={{
              pathname: '/prefselector',
              state: {
                userName,
                prefInputs: groupStatus.names.filter((name) => name !== userName),
                groupName: groupStatus.groupName,
              },
            }}
          >
            <Button style={userName ? null : { visibility: 'hidden' }}>Confirm</Button>
          </NavLink>
        </CenterFlex>
      );
    } else if (groupStatus && groupStatus.status === 'algoReady')
      return (
        <CenterFlex>
          All preferences have been submitted - administrator has yet to release results
        </CenterFlex>
      );
  }

  return (
    <Container>
      <h1>Welcome to the Ultimate Matchmaker</h1>
      <label htmlFor="groupIDForm">Input Group ID </label>
      <form style={{ width: '50%' }} onSubmit={verifyGroup}>
        <Form name="groupIDForm" style={{ textAlign: 'center' }} ref={groupIDForm} />
      </form>
      {groupVerificationMsg()}
      {errorMsg}
    </Container>
  );
};

export default UserLanding;
