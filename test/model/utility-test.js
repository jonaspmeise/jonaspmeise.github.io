describe('Utility tests', () => {
    let utility;

    beforeEach(() => {
        utility = new Utility();
    });

    describe('Unit tests', () => {

        // ************
        // Test: Values from Data Row Objects are correctly inserted into given SVG source code
        // ************

        function generateTransformationTest(before, after, dataObject, description = null) {
            it((description === null) ? `Model transforms SVG code ${before} correctly` : description, () => {
                chai.assert.equal(utility.applyRules(before, dataObject), after);
            });
        }

        function createTestElement(before, after, description = null) {
            return {
                before: before,
                after: after,
                description: description
            }
        }

        const testElemens = [
            createTestElement('<svg><text>${abc}</text></svg>', '<svg><text>inserted</text></svg>'),
            createTestElement('<svg>${$abc}</svg>', '<svg>${$abc}</svg>', 'Falsely used wildcards are ignored'),
            createTestElement('non-svg-code is ignored', 'non-svg-code is ignored', 'Given SVG code without any wildcards, return the same code'),
            createTestElement('${${abc}}', '123', 'Nested wildcards are replaced recursively'),
            createTestElement('${$${abc}}', '${$inserted}', 'Nested wildcards that have an error are replaced recursively as much as possible'),
            createTestElement('${abc==inserted?1:0}', '1', 'Positive conditional expressions are evaluated correctly'),
            createTestElement('${abc==somethingelse?1:0}', '0', 'Negative conditional expressions are evaluated correctly'),
            createTestElement('${abc==inserted?${inserted}:0}', '123', 'Boolean expression in conditional expression is evaluated')
        ]

        const dataObject = {abc: 'inserted', inserted: '123'};

        testElemens.forEach(testElement => {
            generateTransformationTest(testElement.before, testElement.after, dataObject, testElement.description);
        });
    });
});