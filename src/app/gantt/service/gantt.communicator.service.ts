import { Injectable } from '@angular/core';
import {  Subscription } from 'rxjs';
import {GanttApiService } from './gantt.api.service';
import { GanttDataService } from './gantt.data.service';

@Injectable({
  providedIn: 'root'
})
export class GanttCommunicatorService {
  sseSubs$ = new Subscription();

  constructor(private ganttApiService: GanttApiService, private ganttDataService: GanttDataService) { }

  fireForGanttData() {
    if (this.sseSubs$) {
      this.sseSubs$.unsubscribe();
    }

   this.ganttApiService.handleSSE().subscribe({
      next: (data) => {
        this.ganttDataService.updateData(data)
      }
    });
  }

  listenToGanttData() {
    return this.ganttDataService.dataObs$;
  }
}