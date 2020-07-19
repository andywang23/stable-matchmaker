//input will be one object
//keys will be individual names and values will be rank-ordered preference arrays

function stableRoomies(prefTable) {
  //if stableTable is falsy, then we failed to make stable matches in first phase
  //prompt user with option to randomly swap one set of preferences
  const stableProposalTable = firstPhase(prefTable);
  if (!stableProposalTable) return { error: 'Unstable Matches @ phase 1' };
  const reducedTable = reduceStableTables(stableProposalTable, prefTable);

  console.log(reducedTable);
  console.log(stableProposalTable);
}

//pretty much same logic as gale-shapley algo
function firstPhase(table) {
  let inputTable = { ...table };

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

function reduceStableTables(proposalTable, preferenceTable) {
  let prefTable = { ...preferenceTable };

  //based on proposal table: for each person, we will adjust
  //their preference table such that every other person
  //lower ranked than their current tentative partner will be removed;
  //deleted person will then remove whoever just removed them from their list

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

// function phaseTwo()

const brokenInput = {
  a: ['b', 'c', 'd'],
  b: ['c', 'a', 'd'],
  c: ['a', 'b', 'd'],
  d: ['a', 'b', 'c'],
};

// console.log(firstPhase(brokenInput));

const validInput = {
  1: ['4', '6', '2', '5', '3'],
  2: ['6', '3', '5', '1', '4'],
  3: ['4', '5', '1', '6', '2'],
  4: ['2', '6', '5', '1', '3'],
  5: ['4', '2', '3', '6', '1'],
  6: ['5', '1', '4', '2', '3'],
};

console.log(stableRoomies(validInput));
