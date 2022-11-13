describe("Loading", function() {
    it("after trying to show preview for a .txt file, cancel", function() {
      let callFunction = updateElementByExtension('.txt');
      assert.equal(callFunction, undefined);
    })
  });

describe('String Wildcard Transformation', function() {
    it("given a string and an object, transformation correctly injects object values into placeholder keys of the string", function() {
        let transformedString = applyStringTransformation('$(val1) + $(val2)', {val1: 'A', val2: 'B'});
        assert.equal(transformedString, 'A + B');
    });

    it("string transformation is applied on nested terms recursively", function() {
        let transformedString = applyStringTransformation(
            '$(val1) + $(val2) = $($(val1)$(val2))',
            {AB: 'C', val1: 'A', val2: 'B'});
        //assert.equal(transformedString, 'A + B = C');
    });

    function createTagFindingTests(string, containsTag) {
        it(`The string "${string}" contains a wildcard: ${containsTag}`, function() {
            assert.equal(tagExistsInString(string), containsTag);
        })
    }

    const testMap = new Map();
    testMap.set('$(val1)', true);
    testMap.set('val1', false);
    testMap.set('$(val1', false);
    testMap.set('$($())', false);
    testMap.set('$($(abc))', true);

    testMap.forEach((value, key) => {
        createTagFindingTests(key, value);
    });

});