export class Layer {
    attributes: Map<string, string> = new Map<string, string>();

    constructor(public name: string, public type: string = 'text', public value?: string, public previewVisible: boolean = true) {}

    convertLayerToString() : string {
        const attributes : string = [...this.attributes]
        .map((value, key) => `${key}="${value}"`)
        .join('\n\t');

        return `<!--${this.name}-->\n` +
        `<!--previewVisible=${this.previewVisible}-->\n` + 
        `<${this.type}\n` +
        attributes + `\n` +
        `/>`;
    }   
}