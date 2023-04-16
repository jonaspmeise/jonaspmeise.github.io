import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileSelectionService } from '../services/file-selection.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mainframe',
  templateUrl: './mainframe.component.html',
  styleUrls: ['./mainframe.component.css']
})
export class MainframeComponent implements OnInit{
  @ViewChild('imagePreview', { static: true }) imagePreview!: ElementRef<HTMLImageElement>;

  imageURL !: SafeUrl;
  
  constructor(private fileSelectionService: FileSelectionService, private sanitizer: DomSanitizer) {
  }
  
  ngOnInit() {
    this.fileSelectionService.fileToRender$.subscribe(fileBlob => {
      if(!fileBlob.type.includes("image")) return;

      console.log(fileBlob.size);
      const url = URL.createObjectURL(fileBlob);
      console.log("Temporarily generating blob into ", url);

      this.imageURL = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }
}
