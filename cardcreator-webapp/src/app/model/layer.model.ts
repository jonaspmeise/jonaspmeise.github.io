export class Layer {
    attributes: Map<string, string> = new Map<string, string>();

    constructor(public name: string, public type: string = 'text', public value?: string) {
        this.attributes.set("", "");
    }

    convertLayerToString() : string {
        const attributes : string = [...this.attributes]
            .filter(([_, value]) => value !== 'innerValue')
            .filter(([key, value]) => (value || key)) 
            .map(([key, value]) => `${key}="${value}"`)
            .join('\n\t');

        return `<!--${this.name}-->\n` +
            `<${this.type}\n\t` +
            attributes + `>\n` +
            `</${this.type}>`;
    }   

    sortedAttributes(): [string, string][] {
        return Array.from(this.attributes.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }
}