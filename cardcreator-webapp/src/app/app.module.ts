import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainframeComponent } from './mainframe/mainframe.component';
import { WorkbarModule } from './workbar/workbar.module';

@NgModule({
  declarations: [
    AppComponent,
    MainframeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WorkbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
