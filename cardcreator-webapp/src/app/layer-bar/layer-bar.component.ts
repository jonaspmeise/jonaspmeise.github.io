import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Layer } from '../model/layer.model';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-layer-bar',
  templateUrl: './layer-bar.component.html',
  styleUrls: ['./layer-bar.component.css']
})
export class LayerBarComponent implements OnInit {
  @ViewChild('layerList') layerListRef!: ElementRef;

  imageWidth: number;
  imageHeight: number;
  draggedItem: HTMLElement | undefined;
  isCollapsed = false;

  layers: Layer[] = [];

  constructor(private imageService: ImageService) {
    this.imageWidth = this.imageService.getImageWidth();
    this.imageHeight = this.imageService.getImageHeight();
  }

  ngOnInit(): void {
    this.imageService.updateImage$.subscribe(layers => {
      this.layers = layers;
    });

    this.layers = this.imageService.getLayers();
  }
  
  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer?.setData('text/plain', index.toString());
    this.layerListRef.nativeElement.classList.add('dragging');
  }

  onDragEnd(event: DragEvent) {
    this.layerListRef.nativeElement.classList.remove('dragging');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();

    if(!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    this.layerListRef.nativeElement.classList.add('over');
  }

  onDragLeave(event: DragEvent) {
    this.layerListRef.nativeElement.classList.remove('over');
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer?.getData('text/plain') || '');
    this.layerListRef.nativeElement.classList.remove('over');
    this.imageService.moveLayer(dragIndex, index);
  }

  deleteLayer(index: number) {
    this.imageService.deleteLayer(index);
  }

  renameLayer(layer: Layer) {
    //this.imageService.renameLayer(layer.id, layer.name);
  }

  toggleToolbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  updateImageSize() {
    this.imageService.updateImageSize(this.imageWidth, this.imageHeight);
  }
}