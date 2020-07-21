console.log(
  JSON.stringify({
    prefTable: createPrefTable(30),
    groupName: 'testGroup2000',
  })
);

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

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swap(arr, i, j);
  }
}

function swap(arr, idx1, idx2) {
  [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
}
