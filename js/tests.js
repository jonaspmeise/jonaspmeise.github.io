describe("Old tests", () => {
    describe("Loading", function() {
        it("after trying to show preview for a .txt file, cancel", function() {
        let callFunction = updateElementByExtension('.txt');
        assert.equal(callFunction, undefined);
        })
    });

    describe('String Wildcard Transformation', function() {
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
});

