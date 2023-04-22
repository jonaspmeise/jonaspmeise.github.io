import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FileSelectionService } from '../services/file-selection.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-mainframe',
  templateUrl: './mainframe.component.html',
  styleUrls: ['./mainframe.component.css']
})
export class MainframeComponent implements OnInit {
  @ViewChild('imageHolder', { static: true }) imageHolder !: ElementRef<HTMLImageElement>;

  zoomLevel: number = 100;
  image!: string;
  cursorPosition!: string;

  constructor(private fileSelectionService: FileSelectionService, private imageService: ImageService) {
    
  }
  
  ngOnInit() {
    this.fileSelectionService.base64ToRender$.subscribe(base64Content => {
      this.renderImage(base64Content);
    });

    this.imageService.updateImage$.subscribe(_ => {
      this.renderImage(this.imageService.generateSVG(true));
    });
  }

  renderImage(base64Image: string) {
    if(!base64Image.includes("image")) return;

    console.log(`Rendering image with size: ${base64Image.length}`);
    this.image = base64Image;
  }

  onMouseMove(event: any) {
    const zoomLevel = this.zoomLevel / 100;

    const ratioX = event.offsetX / event.target.clientWidth;
    const ratioY = event.offsetY / event.target.clientHeight;
    const x = ratioX * event.target?.naturalHeight;
    const y = ratioY * event.target?.naturalWidth;

    this.cursorPosition = `(${x}, ${y})`;
  }
}