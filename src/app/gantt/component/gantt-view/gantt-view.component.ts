import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { gantt } from 'dhtmlx-gantt';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-gantt-view',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./gantt-view.component.css'],
  templateUrl: './gantt-view.component.html',
  providers: [AppService],
})
export class GanttViewComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer: ElementRef;
  columns;
  ganttTaskList = [];
  ganttLinkList = [];
  
  constructor(private ganttViewService: AppService) {}

  ngOnInit() {
    this.ganttViewService.fetchProjectData().subscribe((res) => {
      this.setGanttData(res);
    });
  }

  setGanttData(projectData) {
    gantt.config.date_format = '%Y-%m-%d %H:%i';
    gantt.init(this.ganttContainer.nativeElement);
    gantt.parse({ data: projectData.tasks, links: projectData.links });
    gantt.config.columns = this.createColumns();
  }

  createColumns() {
    const columns = [
      {
        uniqColId: 'add',
        name: 'add',
        width: 50,
        sort: true,
        handleBeforeSort: () => {},
        handleOnSort: (col) => {},
        align: 'left',
      },
      {
        uniqColId: 'project',
        name: 'text',
        handleBeforeSort: () => {},
        handleOnSort: (sortType, colDetail) => {},
        label: `<span data-project-col class="column">
            Add
          </span>
          </div>`,
        sort: true,
        width: 250,
        tree: true,
      },
      {
        uniqColId: 'start_date',
        name: 'start_date',
        get label() {
          return `
          <div>
            <span data-${this.uniqColId}-col class="column">
              Start Date
            </span>
          </div>`;
        },
        width: 250,
        sort: true,
        align: 'center',
      },
      {
        uniqColId: 'duration',
        name: 'duration',
        get label() {
          return `
          <div>
          <span data-${this.uniqColId}-col class="column">
            Duration
          </span>
        </div>`;
        },
        width: 60,
        sort: false,
        align: 'center',
      },
    ];

    return columns;
  }
}
