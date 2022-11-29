class RuleApplier {
    constructor() {
        this.rules = [];
        this.generateRules();
    }

    generateRules() {
        const literal = '[^\{\}\$]';

        //Rule for Conditional Expressions
        this.rules.push(
            new Rule(
                `\\$\\{(?<column>${literal}+)==(?<searchValue>${literal}+)\\?(?<valueIfTrue>${literal}+):(?<valueIfFalse>${literal}*)\\}`,
                (text, matchedGroups, referenceObject) => {
                    if (referenceObject[matchedGroups.column] === matchedGroups.searchValue) {
                        return matchedGroups.valueIfTrue;
                    } else {
                        return matchedGroups.valueIfFalse;
                    }
                })
            );

        //Rule for Conditional Expressions
        this.rules.push(
            new Rule(
                `\\$\\{(?<key>${literal}+)\\}`,
                (text, matchedGroups, referenceObject) => {
                    return referenceObject[matchedGroups.key];
                })
            );
    }

    applyRules(sourceCode, dataObject) {
        let keepLooping = true;

        while(keepLooping) {
            keepLooping = false;

            this.rules.forEach(rule => {
                const editedCode = rule.evaluate(sourceCode, dataObject, (oldValue, newValue) => {
                    sourceCode = sourceCode.replaceAll(oldValue, newValue); 

                    //TODO: While loops are very old-school, there is probably a better structure to call these
                    //we edited part of the code and might get new matches in future evaluations
                    keepLooping = true;
                });
            });
        }

        return sourceCode;
    }
}