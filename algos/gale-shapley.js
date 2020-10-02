const cloneDeep = require('lodash/cloneDeep');

//input will be two objects - male and female preference tables
//keys will be individual names and values will be rank-ordered preference arrays

function stableMarriage(malePreference, femalePreference) {
  const malePref = cloneDeep(malePreference);
  const femalePref = cloneDeep(femalePreference);

  if (Object.keys(malePref).length !== Object.keys(femalePref).length) return Error;

  //create proposal table to store temp engagements
  const proposalTable = {};
  for (const female in femalePref) proposalTable[female] = null;

  while (Object.values(proposalTable).includes(null)) {
    //each male proposes to female he prefers most
    //each female is temp engaged to most preferred suitor and rejects all other proposals
    for (const male in malePref) {
      const maleTopPref = malePref[male][0];
      const targetFemalePrefList = femalePref[maleTopPref];

      //if female has no temp proposal, then create one
      if (!proposalTable[maleTopPref]) proposalTable[maleTopPref] = male;
      //else evaluate whether or not she prefers current proposal
      //compare index positions of current proposal to current engagement
      else if (
        targetFemalePrefList.indexOf(male) <
        targetFemalePrefList.indexOf(proposalTable[maleTopPref])
      ) {
        const replacedMale = proposalTable[maleTopPref];
        //male who will be replaced will need to adjust his pref list
        malePref[replacedMale] = malePref[replacedMale].slice(1);
        proposalTable[maleTopPref] = male;
      } else if (
        targetFemalePrefList.indexOf(male) >
        targetFemalePrefList.indexOf(proposalTable[maleTopPref])
      ) {
        //if proposer got rejected, he will adjust his pref list
        malePref[male] = malePref[male].slice(1);
      }
    }
  }

  return proposalTable;
}

module.exports = stableMarriage;
