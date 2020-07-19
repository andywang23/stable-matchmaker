//input will be one object
//keys will be individual names and values will be rank-ordered preference arrays

function stableRoomies(prefTable) {
  //if stableTable is falsy, then we failed to make stable matches in first phase
  //prompt user with option to randomly swap one set of preferences
  const stableProposalTable = getStableTable(prefTable);
  if (!stableProposalTable)
    return { error: 'Unstable Matches @ getStableTable' };
  const reducedPrefTable = reduceStableTables(stableProposalTable, prefTable);

  // console.log(reducedPrefTable);
  // console.log(stableProposalTable);

  const stableOutput = removeCycle(reducedPrefTable);

  return stableOutput
    ? stableOutput
    : { error: 'Unstable Matches @ removeCycle' };
}

//pretty much same logic as gale-shapley algo
function getStableTable(prefTable) {
  let inputTable = { ...prefTable };

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
  let prefTable = { ...preferenceTable };

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
  let reducedPref = { ...reducedPreference };
  let impossibleMatchCondition = false;
  let cycleEntered;

  while (!impossibleMatchCondition && !cycleEntered) {
    cycleEntered = false;
    for (const person in reducedPref) {
      if (reducedPref[person].length <= 1) continue;
      //if all pref lists have been cut down to 1 person
      //then cycleEntered will remain false and loop will exit
      cycleEntered = true;

      const p = [person];
      const q = [reducedPref[person][1]];

      while (true) {
        const currentQ = q[q.length - 1];
        const currentQLastPref = [...reducedPref[currentQ]].pop();
        const currentQLastPrefsSecondPref = reducedPref[currentQLastPref][1];

        if (p.includes(currentQLastPref)) {
          p.push(currentQLastPref);
          break;
        }

        p.push(currentQLastPref);
        q.push(currentQLastPrefsSecondPref);
      }

      q.forEach((person, idx) => {
        const personsLastPref = p[idx + 1];
        const personPrefList = reducedPref[person];
        const lastPrefsPrefList = reducedPref[personsLastPref];

        personPrefList.splice(personPrefList.length - 1, 1);
        lastPrefsPrefList.splice(lastPrefsPrefList.indexOf(person), 1);

        if (!personPrefList.length || !lastPrefsPrefList.length)
          impossibleMatchCondition = true;
      });
    }
  }

  return impossibleMatchCondition ? false : reducedPref;
}

const brokenInputWiki = {
  a: ['b', 'c', 'd'],
  b: ['c', 'a', 'd'],
  c: ['a', 'b', 'd'],
  d: ['a', 'b', 'c'],
};

// console.log(firstPhase(brokenInputWiki));

const validInputIrving = {
  1: ['4', '6', '2', '5', '3'],
  2: ['6', '3', '5', '1', '4'],
  3: ['4', '5', '1', '6', '2'],
  4: ['2', '6', '5', '1', '3'],
  5: ['4', '2', '3', '6', '1'],
  6: ['5', '1', '4', '2', '3'],
};

console.log(stableRoomies(validInputIrving));

const merryAlgoristmasValid = {
  Ralph: ['Penny', 'Boris', 'Oliver', 'Tammy', 'Ginny'],
  Penny: ['Oliver', 'Ginny', 'Ralph', 'Boris', 'Tammy'],
  Boris: ['Oliver', 'Tammy', 'Penny', 'Ralph', 'Ginny'],
  Ginny: ['Ralph', 'Boris', 'Tammy', 'Penny', 'Oliver'],
  Oliver: ['Ralph', 'Penny', 'Ginny', 'Tammy', 'Boris'],
  Tammy: ['Penny', 'Ralph', 'Ginny', 'Boris', 'Oliver'],
};

// console.log(stableRoomies(merryAlgoristmasValid));

console.log(stableRoomies(merryAlgoristmasValid));
