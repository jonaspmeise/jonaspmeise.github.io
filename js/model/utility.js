class Utility {
    constructor() {
        const literal = '[^\{\}\$]';

        this._conditionalExpression = new RegExp(`\\$\\{(?<column>${literal}+)==(?<searchValue>${literal}+)\\?(?<valueIfTrue>${literal}+):(?<valueIfFalse>${literal}*)\\}`, 'gm');

        //TODO: Change this expression so it only evaluates the uppermost inner key and not ouside ones?
        this._generalReplacementExpression = new RegExp(`\\$\\{(?<key>${literal}+)\\}`, 'gm');
    }

    applyRules(sourceCode, dataObject) {
        let keepLooping = true;

        while(keepLooping) {
            keepLooping = false;

            const replacementExpression = sourceCode.matchAll(this._generalReplacementExpression);
            const conditionalExpression = sourceCode.matchAll(this._conditionalExpression);

            Array.from(replacementExpression).forEach(match => {
                console.log(match);
                const valueToInsert = dataObject[match.groups.key];

                if (valueToInsert) {
                    sourceCode = sourceCode.replaceAll(match[0], valueToInsert);

                    //we might get new matches by inserting this conditional
                    keepLooping = true;
                }
            });

            Array.from(conditionalExpression).forEach(match => {
                console.log(match);
                //we might get new matches by resolving this conditional
                keepLooping = true;
                const regexGroup = match.groups;

                if (dataObject[regexGroup.column] === regexGroup.searchValue) {
                    sourceCode = sourceCode.replaceAll(match[0], regexGroup.valueIfTrue);
                } else {
                    sourceCode = sourceCode.replaceAll(match[0], regexGroup.valueIfFalse);
                }
            });
        }

        return sourceCode;
    }
}