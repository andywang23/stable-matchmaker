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

module.exports = { swap, shuffleArray, findMidPoint };
