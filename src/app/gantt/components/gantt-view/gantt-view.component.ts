import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { gantt } from 'dhtmlx-gantt';
import { AppService } from 'src/app/app.service';
import { GanttCommunicatorService } from '../../service/gantt.communicator.service';
@Component({
  selector: 'app-gantt-view',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './gantt-view.component.html',
  styleUrls: ['./gantt-view.component.scss'],
  providers: [AppService]
})
export class GanttViewComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer: ElementRef;
  columns;
  ganttTaskList = [];
  ganttLinkList = [];

  constructor(private ganttCommunicatorService: GanttCommunicatorService) { }

  ngOnInit() {
    this.setConfigs();

    this.fetchProjects();
    this.listenToProjectUpdates()
  }

  createColumns() {
    const columns = [
      {
        uniqColId: 'add',
        name: 'add',
        width: 50,
        align: 'left',
      },
      {
        uniqColId: 'project',
        name: 'text',
        label: 'Add',
        sort: true,
        width: 250,
        tree: true,
      },
      {
        uniqColId: 'start_date',
        name: 'start_date',
       label : 'Start Date',
        width: 250,
        sort: true,
        align: 'center',
      },
      {
        uniqColId: 'duration',
        name: 'duration',
        label : 'Duration',
        width: 60,
        sort: true,
        align: 'center',
      },
    ];

    return columns;
  }

  setConfigs() {
    gantt.config.date_format = '%Y-%m-%d %H:%i';
    gantt.init(this.ganttContainer.nativeElement);
    gantt.config.columns = this.createColumns();
  }

  updateProject(projectData) {
    gantt.parse({ data: projectData.tasks, links: projectData.links });
  }

  listenToProjectUpdates() {
    this.ganttCommunicatorService.listenToGanttData().subscribe({
      next: data => {
        this.updateProject(data);
      }
    })
  }

  fetchProjects() {
    this.ganttCommunicatorService.fireForGanttData();
  }
}
