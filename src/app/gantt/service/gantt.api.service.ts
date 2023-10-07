import { Injectable } from "@angular/core";
import { fromEvent, map, Observable, Subscription } from 'rxjs';

function createProjectTaskObj(task: any) {
    const obj = {
        id: task.id,
        open: true,
        text: task.name,
    };
    return obj;
}

function createSprintTaskObj(task: any, parentId: any) {
    const obj = {
        id: task.id,
        start_date: task.startDate.split('T')[0],
        duration: task.duration,
        text: task.name,
        parent: parentId,
    };
    return obj;
}


@Injectable(
    {
        providedIn: 'root'
    }
)
export class GanttApiService {
    constructor() { }

    handleSSE(): Observable<any> {
        const unsubscribeFromSSE = ({
            sse$,
            subscriptionList,
        }: {
            sse$: EventSource;
            subscriptionList: Subscription;
        }) => {
            subscriptionList && subscriptionList.unsubscribe();
            sse$ && sse$.close();
        };
        const obs = new Observable((subscriber) => {
            const dummySSE = new EventSource(
                'http://localhost:8084/api/fetch-sse',
                {}
            );

            const subscriptionList = new Subscription();

            subscriptionList.add(
                fromEvent(dummySSE, 'project-detail-fetch')
                    .pipe(
                        map((resp: any) => {
                            console.log('resp', resp.data);
                            return JSON.parse(resp.data)
                        }),
                        map((projectData) => {

                            return projectData.reduce(
                                (
                                    acc: {
                                        tasks: any[];
                                        links: any[];
                                    },
                                    ganttData
                                ) => {
                                    acc.links = [...acc.links, ...ganttData.links];
                                    acc.tasks.push(createProjectTaskObj(ganttData));

                                    ganttData.sprints.forEach((each) => {
                                        acc.tasks.push(createSprintTaskObj(each, ganttData.id));
                                    });

                                    return acc;
                                },
                                {
                                    tasks: [],
                                    links: [],
                                }
                            );
                        })
                    )
                    .subscribe({
                        next: (data) => {
                            subscriber.next(data);
                        },
                    })
            );

            subscriptionList.add(
                fromEvent(dummySSE, 'closestream-fetch')
                    .pipe(map((resp: any) => JSON.parse(resp.data)))
                    .subscribe({
                        next: (data) => {
                            console.log('close');

                            unsubscribeFromSSE({
                                sse$: dummySSE,
                                subscriptionList: subscriptionList,
                            });
                        },
                    })
            );

            return () => {
                console.log('SSE, closed');

                unsubscribeFromSSE({
                    sse$: dummySSE,
                    subscriptionList: subscriptionList,
                });
            };
        });

        return obs;
    }
}