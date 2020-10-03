import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/styledComponents';

const CoordContainer = styled.p`
  display: none;
  background-color: #fefefe;
  height: 37.8px;
  line-height: 37.8px;
  padding: 5px;
  margin-top: 22px;
  margin-left: 100px;
  border-radius: 4px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  font-size: 24px;
  font-family: 'Georgia', serif;
`;

const SelectorContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const HolsterWrapper = styled.div`
  float: left;
  background-color: #fefefe;
  width: 290px;
  margin-right: 100px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
  &:after {
    display: block;
    content: ' ';
    clear: both;
  }
`;

const Holster = styled.div`
  height: 40px;
`;

const ListItem = styled.div`
  background-color: #e1e1ec;
  background-color: transparent;
  top: unset;
  left: unset;
  z-index: 1;
  cursor: move;
  width: 250px;
  border-radius: 4px;
  border: 2px solid #d9d9e9;
  border: none;
  text-align: center;
  font-size: 28px;
`;

const PrefSelector = ({ location }) => {
  let { prefInputs, userName, groupName } = location.state;

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
        if (spot.childNodes.length) newPrefList[idx] = spot.childNodes[0].innerText;
        else isFilled = false;
      });
      setPrefList(newPrefList);
      //can def simplify this logic
      if (isFilled) {
        setCanSubmit(true);
      } else setCanSubmit(false);
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
      await fetch('/api/groups', {
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
        <span class="inner">Preference List for {userName}</span>
      </h1>
      <div id="limbo"></div>
      <CoordContainer>
        X: <span id="x-coord"></span> Y: <span id="y-coord"></span>
      </CoordContainer>
      <Button style={canSubmit ? null : { visibility: 'hidden' }} onClick={handleSubmitPref}>
        Submit Preferences!
      </Button>
      <p>{submitStatus}</p>
      <SelectorContainer className="selector-container">
        <HolsterWrapper className="holster-wrapper clearfix">
          {prefInputs.map((person) => (
            <Holster className="holster">
              <ListItem className="list-item">
                <div className="list-item-background">{person}</div>
              </ListItem>
            </Holster>
          ))}
        </HolsterWrapper>

        <div className="list-wrapper">
          {prefInputs.map((person, idx) => (
            <div className={`list-spot spot-${idx}`}></div>
          ))}
        </div>
      </SelectorContainer>
    </main>
  );
};

export default PrefSelector;
