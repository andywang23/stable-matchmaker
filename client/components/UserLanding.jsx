import React from 'react';

import { useState, useEffect } from 'react';
import { fromPairs } from 'lodash';
import { NavLink } from 'react-router-dom';

const UserLanding = (props) => {
  //input form for groupID
  //drop down to choose which user you are
  //drag and drop preference selector

  const [groupVerified, setGroupVerified] = useState(null);
  const [groupStatus, setGroupStatus] = useState(null);
  const [userName, setUserName] = useState('');
  const [prefInput, setPrefInput] = useState([]);

  async function verifyGroup(e) {
    e.preventDefault();
    const candidateGroupID = document.querySelector('#groupIDForm').value;
    const response = await fetch(`/api/groupname/${candidateGroupID}`);
    const parsedRes = await response.json();
    if (!parsedRes.groupName) setGroupVerified(false);
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
      <div className="results">
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
        <div className="group-verified-msg">
          Results released!
          {generateResultInfo()}
        </div>
      );
    } else if (groupStatus && groupStatus.status === 'missing') {
      return (
        <div className="group-verified-msg">
          <div>
            <strong>
              Group "{groupStatus.groupName}" verified - pending results!
            </strong>
          </div>
          <br />
          If you have not yet sent in your preferences - please select your name
          below.
          <select
            name="names"
            id="nameSelector"
            onChange={(e) => setUserName(e.target.value)}
          >
            <option value="">Choose Your Name</option>
            {groupStatus.missing.map((name) => (
              <option value={name}>{name}</option>
            ))}
          </select>
          <br />
          <NavLink
            to={{
              pathname: '/prefselector',
              state: {
                userName,
                prefInputs: groupStatus.names.filter(
                  (name) => name !== userName
                ),
                groupName: groupStatus.groupName,
              },
            }}
          >
            <button className={!userName ? 'hide' : undefined}>Confirm</button>
          </NavLink>
        </div>
      );
    } else return;
  }

  return (
    <div className="user-landing">
      <h1>Welcome to the Ultimate Matchmaker</h1>
      <form onSubmit={verifyGroup}>
        <label htmlFor="groupIDForm">Input Group ID </label>
        <input id="groupIDForm" name="groupIDForm"></input>
      </form>
      {groupVerificationMsg()}
    </div>
  );
};

export default UserLanding;
