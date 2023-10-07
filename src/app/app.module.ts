import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GanttViewComponent } from 'src/gantt/components/gantt-view/gantt-view.component';

@NgModule({
  declarations: [AppComponent,GanttViewComponent],
  imports: [CommonModule, BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
