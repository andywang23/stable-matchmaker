import React from 'react';

import { useState, useEffect } from 'react';

const PrefSelector = (props) => {
  console.log(props);
  let { prefInputs, userName, groupName } = props.location.state;
  // prefInputs = ['andy', 'yolo', 'swag'];
  // userName = 'bob';
  // groupName = 'firstGroup';

  const [canSubmit, setCanSubmit] = useState(false);
  const [prefList, setPrefList] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    const inputScript = document.createElement('script');
    inputScript.append(`var numInputs = ${prefInputs.length}
    `);
    inputScript.async = true;
    document.body.appendChild(inputScript);

    const script = document.createElement('script');
    script.src = '/scripts/prefselector.js';
    script.async = true;
    document.body.appendChild(script);

    const listWrapper = document.querySelector('.list-wrapper');
    const config = { childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
      const listSpots = document.querySelectorAll('.list-spot');
      let isFilled = true;
      const newPrefList = [];
      listSpots.forEach((spot, idx) => {
        if (spot.childNodes.length)
          newPrefList[idx] = spot.childNodes[0].innerText;
        else isFilled = false;
      });
      setPrefList(newPrefList);
      if (isFilled) setCanSubmit(true);
    };
    const observer = new MutationObserver(callback);
    observer.observe(listWrapper, config);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function handleSubmitPref() {
    const body = { personName: userName, groupName, prefArray: prefList };
    try {
      const response = await fetch('/api/groups', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      setSubmitStatus('Preferences Submitted!');
    } catch {
      setSubmitStatus('Error in submitting preferences');
    }
  }

  return (
    <main>
      <h1 id="title">
        <span class="inner">Rank List</span>
      </h1>
      <div id="limbo"></div>
      <p id="coords">
        X: <span id="x-coord"></span> Y: <span id="y-coord"></span>
      </p>
      <button
        id="submit-prefs"
        className={canSubmit === false ? 'hide' : undefined}
        onClick={handleSubmitPref}
      >
        Submit Preferences!
      </button>
      <div>{submitStatus}</div>
      <br />
      <div className="selector-container">
        <div className="holster-wrapper clearfix">
          {prefInputs.map((person) => (
            <div className="holster">
              <div className="list-item object1">
                <div className="list-item-background">{person}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="list-wrapper">
          {prefInputs.map((person, idx) => (
            <div className={`list-spot spot-${idx}`}></div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PrefSelector;
