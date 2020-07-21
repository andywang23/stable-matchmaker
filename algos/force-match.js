//Goal is to swap random set of preferences in least disruptive manner
//Assumes that most people have strong opinions about their first
//and last few preferences but not about the choices in the middle.

//forceMatch will try first to swap one pair of preferences from the
//middle of an individual's list and check to see if that produces
//a stable result

const cloneDeep = require('lodash/cloneDeep');

const testTable = createPrefTable(32);
console.log('forceMatch/', forceMatch(testTable));

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
    const swapMagnitude = Math.ceil(
      (peopleArr.length - 1) / swapMagnitudeArr[swapMagnitudeIdx]
    );

    //shuffle order of people array so that it's more 'fair'
    //in terms of whose pref list we are changing
    shuffleArray(peopleArr);
    console.log('non-swap iterations', iterations);
    output = forceTest(prefList, peopleArr, false, swapMagnitude);
  }

  iterations = 0;
  while (typeof output !== 'object' && iterations < maxIterations) {
    iterations += 1;
    const swapMagnitudeIdx = Math.floor(iterations / (maxIterations / 3 + 1));
    const swapMagnitude = Math.ceil(
      (peopleArr.length - 1) / swapMagnitudeArr[swapMagnitudeIdx]
    );

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

    let swapIndex1 =
      Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

    let swapIndex2 = swapIndex1;

    while (swapIndex2 === swapIndex1) {
      swapIndex2 =
        Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
    }

    swap(personPrefList, swapIndex1, swapIndex2);
    output = stableRoomies(prefList);

    if (typeof output === 'object') break;
    if (!keepSwaps) swap(personPrefList, swapIndex1, swapIndex2);
  }
  return output;
}

function swap(arr, idx1, idx2) {
  [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swap(arr, i, j);
  }
}

function findMidPoint(arr) {
  return Math.ceil(arr.length / 2);
}

function createPrefTable(length) {
  if (length % 2) return 'Error';
  const templateArr = [];
  const outputTable = {};

  for (let i = 0; i < length; i++) templateArr.push(i);

  templateArr.forEach((el) => {
    let prefTable = [...templateArr].filter((num) => num !== el);
    shuffleArray(prefTable);
    prefTable = prefTable.map((el) => (el = el.toString()));
    outputTable[el] = prefTable;
  });

  return outputTable;
}

function stableRoomies(prefTable) {
  //if stableTable is falsy, then we failed to make stable matches in first phase
  //prompt user with option to randomly swap one set of preferences
  const stableProposalTable = getStableTable(prefTable);
  if (!stableProposalTable) return `Error: 'Unstable Matches @ getStableTable'`;

  const reducedPrefTable = reduceStableTables(stableProposalTable, prefTable);
  const stableOutput = removeCycle(reducedPrefTable);

  return stableOutput
    ? stableOutput
    : `Error: 'Unstable Matches @ removeCycle'`;
}

//pretty much same logic as gale-shapley algo
function getStableTable(prefTable) {
  let inputTable = cloneDeep(prefTable);

  const proposalTable = {};
  //if someone is rejected by all others, then it's impossible to have stable matches
  //given the current preference lists
  let impossibleMatchCondition = false;
  for (const person in inputTable) proposalTable[person] = null;

  while (
    Object.values(proposalTable).includes(null) &&
    !impossibleMatchCondition
  ) {
    for (const person in inputTable) {
      const personsTopPref = inputTable[person][0];
      const targetPrefList = inputTable[personsTopPref];

      if (!proposalTable[personsTopPref])
        proposalTable[personsTopPref] = person;
      else if (
        targetPrefList.indexOf(person) <
        targetPrefList.indexOf(proposalTable[personsTopPref])
      ) {
        const replacedPerson = proposalTable[personsTopPref];
        inputTable[replacedPerson] = inputTable[replacedPerson].slice(1);
        proposalTable[personsTopPref] = person;
        if (!inputTable[replacedPerson].length) impossibleMatchCondition = true;
      } else if (
        targetPrefList.indexOf(person) >
        targetPrefList.indexOf(proposalTable[personsTopPref])
      ) {
        inputTable[person] = inputTable[person].slice(1);
        if (!inputTable[person].length) impossibleMatchCondition = true;
      }
    }
  }
  return impossibleMatchCondition ? false : proposalTable;
}

//based on proposal table: for each person, we will adjust
//their preference table such that every other person
//lower ranked than their current tentative partner will be removed;
//deleted person will then remove whoever just removed them from their list

function reduceStableTables(proposalTable, preferenceTable) {
  let prefTable = cloneDeep(preferenceTable);

  for (const person in proposalTable) {
    const currPartner = proposalTable[person];

    const removedArr = prefTable[person].splice(
      prefTable[person].indexOf(currPartner) + 1
    );

    removedArr.forEach((removedPerson) => {
      prefTable[removedPerson].splice(
        prefTable[removedPerson].indexOf(person),
        1
      );
    });
  }
  return prefTable;
}

//cycle through stable pref list
//for everyone with multiple preferences left,
//create two arrays - p & q
//q[0] === p[0]'s second preference
//p[1] === q[0]'s last preference
//q[1] === p[1]'s second preference and so on
//until one person shows up twice in an array
//then eliminate all second to last pairings

//if anyone's pref list becomes empty, no
//stable pairings exist

//otherwise, stop loop when everyone has one pair

function removeCycle(reducedPreference) {
  let reducedPref = cloneDeep(reducedPreference);
  let impossibleMatchCondition = false;
  let cycleEntered = true;

  while (!impossibleMatchCondition && cycleEntered) {
    cycleEntered = false;

    let noSecondPrefFound;

    for (const person in reducedPref) {
      noSecondPrefFound = false;
      if (reducedPref[person].length <= 1) continue;
      //if all pref lists have been cut down to 1 person
      //then cycleEntered will remain false and loop will exit
      cycleEntered = true;

      const p = [person];
      const q = [reducedPref[person][1]];

      while (true) {
        const currentQ = q[q.length - 1];
        const currentQPrefList = reducedPref[currentQ];

        const currentQLastPref = currentQPrefList[currentQPrefList.length - 1];
        if (reducedPref[currentQLastPref][1] === undefined) {
          impossibleMatchCondition = true;
          break;
        }
        const currentQLastPrefsSecondPref = reducedPref[currentQLastPref][1];

        if (p.includes(currentQLastPref)) {
          p.push(currentQLastPref);
          break;
        } else p.push(currentQLastPref);

        if (q.includes(currentQLastPrefsSecondPref)) break;
        else q.push(currentQLastPrefsSecondPref);
      }

      if (!impossibleMatchCondition)
        q.forEach((person, idx) => {
          const personsLastPref = p[idx + 1];
          const personPrefList = reducedPref[person];
          const lastPrefsPrefList = reducedPref[personsLastPref];

          personPrefList.splice(personPrefList.indexOf(personsLastPref), 1);
          lastPrefsPrefList.splice(lastPrefsPrefList.indexOf(person), 1);

          if (!personPrefList.length || !lastPrefsPrefList.length)
            impossibleMatchCondition = true;
        });
      //if we hit a loop, we need to start from the top of the table
      //e.g. if we just looked at person 1, but person 1 still has
      //multiple preferences, then we need to examine his list again
      break;
    }
  }

  return impossibleMatchCondition ? false : reducedPref;
}
