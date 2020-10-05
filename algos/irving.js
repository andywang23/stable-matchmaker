const cloneDeep = require('lodash/cloneDeep');

//input will be one object
//keys will be individual names and values will be rank-ordered preference arrays

function stableRoomies(prefTable) {
  //if stableTable is falsy, then we failed to make stable matches in first phase
  //prompt user with option to randomly swap one set of preferences
  const stableProposalTable = getStableTable(prefTable);
  if (!stableProposalTable) return `Error: 'Unstable Matches @ getStableTable'`;

  const reducedPrefTable = reduceStableTables(stableProposalTable, prefTable);
  const stableOutput = removeCycle(reducedPrefTable);

  return stableOutput ? stableOutput : `Error: 'Unstable Matches @ removeCycle'`;
}

//pretty much same logic as gale-shapley algo
function getStableTable(preferenceTable) {
  let prefTable = cloneDeep(preferenceTable);

  const proposalTable = {};
  //if someone is rejected by all others, then it's impossible to have stable matches
  //given the current preference lists
  let impossibleMatchCondition = false;
  for (const person in prefTable) proposalTable[person] = null;

  while (Object.values(proposalTable).includes(null) && !impossibleMatchCondition) {
    for (const person in prefTable) {
      const [personsTopPref] = prefTable[person];
      const targetPrefList = prefTable[personsTopPref];

      if (!proposalTable[personsTopPref]) proposalTable[personsTopPref] = person;
      else if (
        targetPrefList.indexOf(person) < targetPrefList.indexOf(proposalTable[personsTopPref])
      ) {
        const replacedPerson = proposalTable[personsTopPref];
        prefTable[replacedPerson] = prefTable[replacedPerson].slice(1);
        proposalTable[personsTopPref] = person;
        if (!prefTable[replacedPerson].length) impossibleMatchCondition = true;
      } else if (
        targetPrefList.indexOf(person) > targetPrefList.indexOf(proposalTable[personsTopPref])
      ) {
        prefTable[person] = prefTable[person].slice(1);
        if (!prefTable[person].length) impossibleMatchCondition = true;
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

    const removedArr = prefTable[person].splice(prefTable[person].indexOf(currPartner) + 1);

    removedArr.forEach((removedPerson) => {
      prefTable[removedPerson].splice(prefTable[removedPerson].indexOf(person), 1);
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

          if (!personPrefList.length || !lastPrefsPrefList.length) impossibleMatchCondition = true;
        });
      //if we hit a loop, we need to start from the top of the table
      //e.g. if we just looked at person 1, but person 1 still has
      //multiple preferences, then we need to examine his list again
      break;
    }
  }

  return impossibleMatchCondition ? false : reducedPref;
}

module.exports = stableRoomies;
