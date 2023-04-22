export class Layer {
    attributes: Map<string, string> = new Map<string, string>();

    constructor(public name: string, public type: string = 'text', public value?: string) {}

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
}