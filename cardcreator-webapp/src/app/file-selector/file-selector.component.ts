import { Component, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../services/file.service';
import { FileSelectionService } from '../services/file-selection.service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent {
  @ViewChild('fileSelectList') fileSelectList!: ElementRef;
  
  files: File[] = [];

  constructor(private fileService: FileService, private fileSelectionService: FileSelectionService) {}

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
}
