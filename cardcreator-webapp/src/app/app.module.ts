import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainframeComponent } from './mainframe/mainframe.component';
import { WorkbarModule } from './workbar/workbar.module';
import { LayerBarComponent } from './layer-bar/layer-bar.component';
import { LayerComponent } from './layer/layer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainframeComponent,
    LayerBarComponent,
    LayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WorkbarModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
