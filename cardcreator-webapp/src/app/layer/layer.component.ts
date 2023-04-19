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

  public startEditingLayerName(): void {
      this.isEditingLayerName = true;
  }

  public stopEditingLayerName(): void {
      this.isEditingLayerName = false;
  }

  public saveLayerName(): void {
      this.imageService.renameLayer(this.layer, this.layer.name);
      this.stopEditingLayerName();
  }
}