import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileSelectionService {
  private base64ToRender = new Subject<string>();
  base64ToRender$ = this.base64ToRender.asObservable();

  selectContent(content: string | undefined) {
    if(!content) return;
    
    this.base64ToRender.next(content);
  }
}