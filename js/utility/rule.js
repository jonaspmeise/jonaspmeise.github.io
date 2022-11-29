class Rule {
    constructor(...args) {
        [this._rule, this.applyFunction] = args;
    }

    toString() {
        return this._rule;
    }

    get rule() {
        return this.asRegex();
    }

    set rule(newRule) {
        this._rule = newRule;
    }

    asRegex() {
        return new RegExp(this._rule, 'gm');
    }

    evaluate(text, referenceObject, matchAppliedCallback) {
        const regexMatches = text.matchAll(this.asRegex());

        Array.from(regexMatches).forEach(match => {
            matchAppliedCallback(match[0], this.applyFunction(text, match.groups, referenceObject));
        });
    }
}