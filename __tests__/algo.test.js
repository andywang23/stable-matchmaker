import stableRoomies from '../algos/irving';

//Integration Testing for Irving Algo
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

  it('should correctly derive matchable sets', () => {
    const validInputIrving = {
      1: ['4', '6', '2', '5', '3'],
      2: ['6', '3', '5', '1', '4'],
      3: ['4', '5', '1', '6', '2'],
      4: ['2', '6', '5', '1', '3'],
      5: ['4', '2', '3', '6', '1'],
      6: ['5', '1', '4', '2', '3'],
    };

    expect(stableRoomies(validInputIrving)).toEqual({
      1: ['6'],
      2: ['3'],
      3: ['2'],
      4: ['5'],
      5: ['4'],
      6: ['1'],
    });

    const validInputWiki = {
      1: ['3', '4', '2', '6', '5'],
      2: ['6', '5', '4', '1', '3'],
      3: ['2', '4', '5', '1', '6'],
      4: ['5', '2', '3', '6', '1'],
      5: ['3', '1', '2', '4', '6'],
      6: ['5', '1', '3', '4', '2'],
    };

    expect(stableRoomies(validInputWiki)).toEqual({
      1: ['6'],
      2: ['4'],
      3: ['5'],
      4: ['2'],
      5: ['3'],
      6: ['1'],
    });

    const validInputIrving8 = {
      1: ['2', '5', '4', '6', '7', '8', '3'],
      2: ['3', '6', '1', '7', '8', '5', '4'],
      3: ['4', '7', '2', '8', '5', '6', '1'],
      4: ['1', '8', '3', '5', '6', '7', '2'],
      5: ['6', '1', '8', '2', '3', '4', '7'],
      6: ['7', '2', '5', '3', '4', '1', '8'],
      7: ['8', '3', '6', '4', '1', '2', '5'],
      8: ['5', '4', '7', '1', '2', '3', '6'],
    };

    expect(stableRoomies(validInputIrving8)).toEqual({
      1: ['4'],
      2: ['3'],
      3: ['2'],
      4: ['1'],
      5: ['6'],
      6: ['5'],
      7: ['8'],
      8: ['7'],
    });

    const validMerryAlgoristmas = {
      Ralph: ['Penny', 'Boris', 'Oliver', 'Tammy', 'Ginny'],
      Penny: ['Oliver', 'Ginny', 'Ralph', 'Boris', 'Tammy'],
      Boris: ['Oliver', 'Tammy', 'Penny', 'Ralph', 'Ginny'],
      Ginny: ['Ralph', 'Boris', 'Tammy', 'Penny', 'Oliver'],
      Oliver: ['Ralph', 'Penny', 'Ginny', 'Tammy', 'Boris'],
      Tammy: ['Penny', 'Ralph', 'Ginny', 'Boris', 'Oliver'],
    };

    expect(stableRoomies(validMerryAlgoristmas)).toEqual({
      Ralph: ['Boris'],
      Penny: ['Oliver'],
      Boris: ['Ralph'],
      Ginny: ['Tammy'],
      Oliver: ['Penny'],
      Tammy: ['Ginny'],
    });
  });
});
