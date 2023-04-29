import { Component, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../services/file.service';
import { FileSelectionService } from '../services/file-selection.service';
import { ImageService } from '../services/image.service';
import { Layer } from '../model/layer.model';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent {
  @ViewChild('fileSelectList') fileSelectList!: ElementRef;
  
  files: File[] = [];

  constructor(private fileService: FileService, 
    private fileSelectionService: FileSelectionService, 
    private imageService: ImageService) {}

  onLoadFile(eventTarget: any): void {
    this.fileService.upload(eventTarget.files)
      .then((loadedFiles: File[]) => {
        this.files.push(...loadedFiles);
      });
  }

  onFileSelected(): void {
    const selectedFiles: string[] = [...this.fileSelectList.nativeElement.selectedOptions].map((option: any) => option.value);
    
    console.log(selectedFiles);

    if(selectedFiles.length === 1) {
      //show / load single file
      this.fileSelectionService.selectContent(this.fileService.fetchBase64(selectedFiles[0]));
    } else {
      //TODO: something different...
    }
  }

  onDragStart(event: any, file: any) {
    console.log('DRAGGING', file, event);
  }

  insertNewLayer(file: File) {
    const fileContent: string | undefined = this.fileService.fetchBase64(file.webkitRelativePath);
    if(!fileContent || !fileContent.startsWith('data:image')) return;

    const imageLayer = new Layer(file.name, 'image', undefined);
    imageLayer.attributes.set('src', `@FILE{${file.webkitRelativePath}}`);

    this.imageService.addLayer(imageLayer);
  }
}
