import React from 'react';

import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';

const AdminMain = (props) => {
  //input form for groupID
  //drop down to choose which user you are
  //drag and drop preference selector

  const [groupVerified, setGroupVerified] = useState(null);
  const [groupStatus, setGroupStatus] = useState(null);

  async function verifyGroup(e) {
    e.preventDefault();
    const candidateGroupID = document.querySelector('#groupIDForm').value;
    const response = await fetch(`/api/groupname/${candidateGroupID}`);
    const parsedRes = await response.json();
    if (!parsedRes) setGroupVerified(false);
    else {
      setGroupVerified(true);
      setGroupStatus(parsedRes);
    }
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

  function groupVerificationMsg() {
    if (groupVerified === false) return <div>Incorrect Group ID</div>;
    else if (groupStatus && groupStatus.status === 'results') {
      return (
        <div>
          Results released!
          {generateResultInfo()}
        </div>
      );
    } else if (groupStatus === 'missing') {
      return (
        <div>
          Group Verified! Please select preferences for {groupStatus.groupName}
        </div>
      );
    } else return;
  }

  return (
    <div>
      <form onSubmit={verifyGroup}>
        <label htmlFor="groupIDForm">Input Group ID</label>
        <input id="groupIDForm" name="groupIDForm"></input>
      </form>
      {groupVerificationMsg()}
    </div>
  );
};

export default AdminMain;
