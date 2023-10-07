import { Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class GanttDataService {
    private data$: Subject<any> = new Subject();
    dataObs$ = this.data$.asObservable();

    constructor() {}

    updateData(data: {
        tasks: any,
        links: any
    }) {
        this.data$.next(data);
    }
}