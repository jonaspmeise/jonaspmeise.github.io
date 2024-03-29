import { Injectable, OnInit } from '@angular/core';
import { Layer } from '../model/layer.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageWidth: number;
  private imageHeight: number;

  private updateImage = new Subject<Layer[]>();
  updateImage$ = this.updateImage.asObservable();

  private layers : Layer[] = [new Layer("Testlayer"), new Layer("Layer 2", "text")];

  constructor() {
    this.imageWidth = 750; // default width
    this.imageHeight = 1050; // default height

    const testLayer: Layer = new Layer("Testlayer #2");
    testLayer.attributes.set("color", "red");

    this.layers.push(testLayer);
  }

  getImageWidth() {
    return this.imageWidth;
  }

  getImageHeight() {
    return this.imageHeight;
  }

  updateImageSize(width: number, height: number) {
    this.imageWidth = width;
    this.imageHeight = height;

    console.log(`New image size: ${this.imageWidth}x${this.imageHeight}`);

    this.notifyUpdate();
  }

  moveLayer(dragIndex: number, index: number) {
    const layer = this.layers[dragIndex];
    this.layers.splice(dragIndex, 1);
    this.layers.splice(index, 0, layer);

    this.notifyUpdate();
  }

  deleteLayer(index: number) {
    this.layers.splice(index);

    this.notifyUpdate();
  }

  removeLayer(layer: Layer) {
    console.log(this.layers.indexOf(layer))
    this.layers.splice(this.layers.indexOf(layer), 1) 
  
    this.notifyUpdate();
  }

  generateSVG(encode: boolean = false): string {
    const svgCode = `<svg width="${this.imageWidth}" height="${this.imageHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${this.layers.map(layer => layer.convertLayerToString()).join('\n')}
      </svg>`;

    console.log(`Generated SVG-code: ${svgCode}`);

    return encode ? 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgCode) : svgCode;
  }

  getLayers(): Layer[] {
    return this.layers;
  }

  addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  notifyUpdate() {
    this.updateImage.next(this.layers);
  }

  renameLayer(layer: Layer, name: string) : void {
    console.log(`Set name of ${layer} @ ${this.layers.indexOf(layer)} to: ${name}`);
    layer.name = name;

    this.notifyUpdate();
  }

  addAttribute(layer: Layer, key: string, value: string) {
    layer.attributes.set(key, value);

    this.notifyUpdate();
  }

  removeAttribute(layer: Layer, key: string, value: string) {
    layer.attributes.delete(key);
    layer.attributes.set("", "");

    this.notifyUpdate();
  }
}