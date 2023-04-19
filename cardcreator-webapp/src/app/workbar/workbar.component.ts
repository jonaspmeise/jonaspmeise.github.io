import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-workbar',
  templateUrl: './workbar.component.html',
  styleUrls: ['./workbar.component.css']
})
export class WorkbarComponent {
  isCollapsed = false;

  toggleToolbar() {
    this.isCollapsed = !this.isCollapsed;
  }
}