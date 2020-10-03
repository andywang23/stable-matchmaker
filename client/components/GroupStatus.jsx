import React from 'react';
import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';
import loadingIcon from '../assets/loading-icon.gif';
import { CenterFlex } from '../styles/sharedStyles';

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
        <ul>
          {groupStatus.missing.map((person) => (
            <li>{person}</li>
          ))}
        </ul>
        <br />
        <div className="completed-pref-forms">
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
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td colSpan="1000">Partner</td>
            </tr>
          </thead>
          {resultTableRows}
        </table>
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
        await new Promise((r) => setTimeout(r, 4000));

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
          <img id="loading" src={loadingIcon}></img>
        ) : (
          <div className="select-button" onClick={handleAlgoBtnClick}>
            <strong>ALGO TIME</strong>
          </div>
        )}
      </>
    );
  }

  return (
    <CenterFlex>
      <h4>Group Status</h4>
      <select name="groups" id="groupSelector" onChange={handleSelectChange}>
        <option value="">Choose Available Groups</option>
        {groups.map((group) => (
          <option value={group}>{group}</option>
        ))}
      </select>
      {groupStatusDisplayRouter()}
    </CenterFlex>
  );
};

export default GroupStatus;
