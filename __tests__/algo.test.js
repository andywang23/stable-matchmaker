import stableRoomies from '../algos/irving';

describe('Irving/Stable Roomie Algorithm', () => {
  it("should correctly identify unmatchable sets identified at the 'generate stable table' step", () => {
    const brokenInputFromWiki = {
      a: ['b', 'c', 'd'],
      b: ['c', 'a', 'd'],
      c: ['a', 'b', 'd'],
      d: ['a', 'b', 'c'],
    };

    expect(stableRoomies(brokenInputFromWiki)).toEqual(
      "Error: 'Unstable Matches @ getStableTable'"
    );
  });

  it("should correctly identify unmatchable sets identified at the 'remove cycle' step", () => {
    const brokenInputIrving = {
      1: ['2', '6', '4', '3', '5'],
      2: ['3', '5', '1', '6', '4'],
      3: ['1', '6', '2', '5', '4'],
      4: ['5', '2', '3', '6', '1'],
      5: ['6', '1', '3', '4', '2'],
      6: ['4', '2', '5', '1', '3'],
    };

    expect(stableRoomies(brokenInputIrving)).toEqual("Error: 'Unstable Matches @ removeCycle'");
  });
});
