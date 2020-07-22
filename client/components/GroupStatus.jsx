import React from 'react';

import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';

const GroupStatus = (props) => {
  const { userName } = props;

  const [groups, setGroups] = useState([]);
  const [groupStatus, setGroupStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getGroups();
  }, []);

  function getGroups() {
    fetch(`/api/groups/${userName}`)
      .then((res) => res.json())
      .then((resArr) => setGroups(resArr));
  }

  async function handleSelectChange(e) {
    if (!e.target.value) setGroupStatus('');
    const response = await fetch(`/api/groupstatus/${e.target.value}`);
    const parsedRes = await response.json();
    console.log(parsedRes);
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
      <div>
        <div>Missing Submissions From:</div>
        <ul>
          {groupStatus.missing.map((person) => (
            <li>{person}</li>
          ))}
        </ul>
        <div>Completed Preference Forms:</div>
        <table>
          <tr>
            <td>Name</td>
            <td colSpan="1000">Preferences</td>
          </tr>
          {prefTableRows}
        </table>
      </div>
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
      <div>
        <div>RESULTS</div>
        <table>
          {/* <tr>
            <td>Name</td>
            <td colSpan="1000">Preferences</td>
          </tr> */}
          {resultTableRows}
        </table>
      </div>
    );
  }

  function generateAlgoButton() {
    async function handleAlgoBtnClick() {
      const body = {
        prefTable: groupStatus.prefList,
        groupName: groupStatus.groupName,
      };

      try {
        const results = await fetch('/algos/force-match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const parsedRes = await results.json();

        setGroupStatus({
          ...groupStatus,
          status: 'results',
          results: parsedRes,
        });
        return groupStatusDisplayRouter();
      } catch {
        setErrorMsg('Could not access server');
      }
    }
    return (
      <div className="center">
        <div className="select-button" onClick={handleAlgoBtnClick}>
          <strong>ALGO TIME</strong>
        </div>
      </div>
    );
  }

  return (
    <div>
      See Group Status
      <br />
      <select name="groups" id="groupSelector" onChange={handleSelectChange}>
        <option value="">Choose Available Groups</option>
        {groups.map((group) => (
          <option value={group}>{group}</option>
        ))}
      </select>
      {groupStatusDisplayRouter()}
      <br />
      <br />
      <br />
    </div>
  );
};

export default GroupStatus;
