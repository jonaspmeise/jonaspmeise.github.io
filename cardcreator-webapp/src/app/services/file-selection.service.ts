import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileSelectionService {
  private fileToRender = new Subject<Blob>();
  fileToRender$ = this.fileToRender.asObservable();

  selectFile(fileBlob: Blob | undefined) {
    if(!fileBlob) return;
    
    this.fileToRender.next(fileBlob);
  }
}