/*
Goal is to swap random set of preferences in least disruptive manner
Assumes that most people have strong opinions about their first
and last few preferences but not about the choices in the middle.
forceMatch will try first to swap one random pair of preferences from the
middle of an individual's list and check to see if that produces a stable result
 */

const cloneDeep = require('lodash/cloneDeep');
const { swap, shuffleArray, findMidPoint } = require('./utils');
const stableRoomies = require('./irving');

function forceMatch(preferenceList) {
  const prefList = cloneDeep(preferenceList);
  const peopleArr = Object.keys(prefList);
  const maxIterations = peopleArr.length * 15;

  let output = stableRoomies(prefList);

  const swapMagnitudeArr = [10, 7, 5];

  let iterations = 0;
  while (typeof output !== 'object' && iterations < maxIterations) {
    iterations += 1;
    const swapMagnitudeIdx = Math.floor(iterations / (maxIterations / 3 + 1));
    const swapMagnitude = Math.ceil((peopleArr.length - 1) / swapMagnitudeArr[swapMagnitudeIdx]);

    //shuffle order of people array so that it's more 'fair'
    //in terms of whose pref list we are changing first
    shuffleArray(peopleArr);
    console.log('non-swap iterations', iterations);
    output = forceTest(prefList, peopleArr, false, swapMagnitude);
  }

  iterations = 0;
  while (typeof output !== 'object' && iterations < maxIterations) {
    iterations += 1;
    const swapMagnitudeIdx = Math.floor(iterations / (maxIterations / 3 + 1));
    const swapMagnitude = Math.ceil((peopleArr.length - 1) / swapMagnitudeArr[swapMagnitudeIdx]);

    shuffleArray(peopleArr);

    console.log('swap iterations', iterations);
    output = forceTest(prefList, peopleArr, true, swapMagnitude);
  }

  return output;
}

function forceTest(preferenceList, peopleArray, keepSwaps, swapMagnitude) {
  let output;

  let prefList;
  if (!keepSwaps) prefList = cloneDeep(preferenceList);
  else prefList = preferenceList;

  for (let i = 0; i < peopleArray.length; i++) {
    const person = peopleArray[i];
    const personPrefList = prefList[person];
    const midIndex = findMidPoint(personPrefList);
    const maxIndex = midIndex + swapMagnitude;
    const minIndex = midIndex - swapMagnitude;

    let swapIndex1 = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

    let swapIndex2 = swapIndex1;

    while (swapIndex2 === swapIndex1)
      swapIndex2 = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

    swap(personPrefList, swapIndex1, swapIndex2);
    output = stableRoomies(prefList);

    if (typeof output === 'object') break;
    if (!keepSwaps) swap(personPrefList, swapIndex1, swapIndex2);
  }
  return output;
}

module.exports = forceMatch;
