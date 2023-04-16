import { NgModule } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';
import { WorkbarComponent } from './workbar.component';
import { FileSelectorComponent } from '../file-selector/file-selector.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    WorkbarComponent,
    FileSelectorComponent
  ],
  imports: [
    ResizableModule,
    CommonModule
  ],
  exports: [
    WorkbarComponent,
    FileSelectorComponent
  ]
})
export class WorkbarModule { }
