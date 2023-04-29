export class Layer {
    attributes: Map<string, string> = new Map<string, string>();

    constructor(public name: string, public type: string = 'text', public value?: string) {
        this.attributes.set("", "");
    }

    convertLayerToString() : string {
        const normalAttributes : string = [...this.attributes]
            .filter(([key, _]) => key !== '')
            .filter(([_, value]) => value !== 'value')
            .filter(([key, value]) => (value || key)) 
            .map(([key, value]) => `${key}="${value}"`)
            .join('\n\t');

        return `<!--${this.name}-->\n` +
            `<${this.type}\n\t` +
            normalAttributes + `>\n` +
            this.attributes.get('value') + `\n` +
            `</${this.type}>`;
    } 
}