import { Component, Input } from '@angular/core';
import { Layer } from '../model/layer.model';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent {
  @Input() layer!: Layer;

  public isEditingLayerName: boolean = false;

  constructor(private imageService: ImageService) {}

  public editName(): void {
    const newName = this.promptNewValue(this.layer.name, this.layer.name);

    if(newName) {
      this.imageService.renameLayer(this.layer, newName);
    }
  }

  private promptNewValue(name: string, oldValue: string): string | null {
    return prompt(`Enter a new value for '${name}':`, this.layer.name);
  }

  onChangedRow(key: string, value: string) {
    this.imageService.addAttribute(this.layer, key, value);
  }

  deleteRow(key: string, value: string) {
    this.imageService.removeAttribute(this.layer, key, value);
  }
}