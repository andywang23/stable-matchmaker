import React, { useState, useEffect } from 'react';
import loadingIcon from '../assets/loading-icon.gif';
import { CenterFlex, Select, Table, TableCell } from '../styles/styledComponents';
import styled from 'styled-components';

const AlgoButton = styled.div`
  width: 200px;
  height: 180px;
  line-height: 200px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  background: #f74d4d;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #f74d4d),
    color-stop(100%, #f86569)
  );
  box-shadow: 0 15px #e24f4f;
  &:active {
    box-shadow: 0 0 #e24f4f;
    transition: 0.1s all ease-out;
  }
`;

const GroupStatus = ({ userName }) => {
  const [groups, setGroups] = useState([]);
  const [groupStatus, setGroupStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [algoLoading, setAlgoLoading] = useState(false);

  useEffect(() => {
    //get groups
    (async () => {
      try {
        const res = await fetch(`/api/groups/${userName}`);
        const parsedRes = await res.json();
        setGroups(parsedRes);
      } catch {
        setErrorMsg('Error: Could not get groups');
      }
    })();
  }, []);

  async function handleSelectChange(e) {
    if (!e.target.value) setGroupStatus('');
    const res = await fetch(`/api/groupstatus/${e.target.value}`);
    const parsedRes = await res.json();
    setGroupStatus(parsedRes);
  }

  function groupStatusDisplayRouter() {
    switch (groupStatus.status) {
      case '':
        return '';

      case 'missing':
        return generateMissingStatusInfo();

      case 'results':
        return generateResultInfo();

      case 'algoReady':
        return generateAlgoButton();
    }
  }

  function generateMissingStatusInfo() {
    const submittedLists = groupStatus.submittedPrefList;
    let prefTableRows = [];
    for (const person in submittedLists) {
      prefTableRows.push(
        <tr>
          <td>{person}</td>
          {submittedLists[person].map((pref) => (
            <td>{pref}</td>
          ))}
        </tr>
      );
    }
    return (
      <CenterFlex>
        <div>
          <strong>Group Invite ID:</strong> {groupStatus.id}
        </div>
        <br />
        <div>
          <strong>Missing Submissions From:</strong>
        </div>
        <ul style={{ padding: 0 }}>
          {groupStatus.missing.map((person) => (
            <li>{person}</li>
          ))}
        </ul>
        <br />
        <div style={{ marginBottom: '1em' }}>
          <strong>Completed Preference Forms: </strong>
        </div>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td colSpan="1000">Preferences</td>
            </tr>
          </thead>
          {prefTableRows}
        </table>
      </CenterFlex>
    );
  }

  function generateResultInfo() {
    const resultTable = groupStatus.results;
    const resultTableRows = [];
    for (const person in resultTable) {
      resultTableRows.push(
        <tr>
          <td>{person}</td>
          <td>{resultTable[person]}</td>
        </tr>
      );
    }
    return (
      <CenterFlex>
        <Table>
          <TableHead>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell colSpan="1000">Partner</TableCell>
            </tr>
          </TableHead>
          {resultTableRows}
        </Table>
      </CenterFlex>
    );
  }

  function generateAlgoButton() {
    async function handleAlgoBtnClick() {
      const body = {
        prefTable: groupStatus.prefList,
        groupName: groupStatus.groupName,
      };

      setAlgoLoading(true);
      try {
        const results = await fetch('/algos/force-match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const parsedRes = await results.json();
        //TO BLOCK THREAD FOR FAKE LOADING ICON
        await new Promise((r) => setTimeout(r, 2000));

        setAlgoLoading(false);

        setGroupStatus({
          ...groupStatus,
          status: 'results',
          results: parsedRes,
        });
        return groupStatusDisplayRouter();
      } catch {
        setErrorMsg('Error: Could not access server');
      }
    }

    return (
      <>
        {algoLoading ? (
          <img style={{ width: '80px', height: '80px' }} src={loadingIcon}></img>
        ) : (
          <AlgoButton onClick={handleAlgoBtnClick}>
            <strong>Matchmaking Time</strong>
          </AlgoButton>
        )}
      </>
    );
  }

  return (
    <CenterFlex>
      <h4>Group Status</h4>
      <Select name="groups" onChange={handleSelectChange}>
        <option value="">Choose Available Groups</option>
        {groups.map((group) => (
          <option value={group}>{group}</option>
        ))}
      </Select>
      {groupStatusDisplayRouter()}
      {errorMsg}
    </CenterFlex>
  );
};

export default GroupStatus;
