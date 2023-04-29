export class Layer {
    attributes: Map<string, string> = new Map<string, string>();

    constructor(public name: string, public type: string = 'text', public value?: string, attributes?: Map<string, string>) {
        if(attributes) attributes.forEach(([value, key]) => this.attributes.set(key, value));

        this.attributes.set("", "");
    }

    convertLayerToString() : string {
        const normalAttributes : string = [...this.attributes]
            .filter(([key, _y]) => key !== '')
            .filter(([key, _]) => key !== 'value')
            .filter(([key, value]) => (value || key)) 
            .map(([key, value]) => `${key}="${value}"`)
            .join('\n\t');

        console.log(this.attributes, normalAttributes);

        return `<!--${this.name}-->\n` +
            `<${this.type}\n\t` +
            normalAttributes + `>\n` +
            (this.attributes.has('value') ? this.attributes.get('value') + `\n` : '') +
            `</${this.type}>`;
    }
}