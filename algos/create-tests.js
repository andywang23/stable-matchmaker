const { shuffleArray } = require('./utils');
const forceMatch = require('./force-match');

function createPrefTable(length) {
  if (length % 2) return 'Error';
  const templateArr = [];
  const outputTable = {};

  for (let i = 0; i < length; i++) templateArr.push(i.toString());

  templateArr.forEach((el) => {
    let prefTable = [...templateArr].filter((num) => num !== el);
    shuffleArray(prefTable);
    outputTable[el] = prefTable;
  });
  return outputTable;
}

console.log(forceMatch(createPrefTable(30)));
