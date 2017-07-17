import { IWikipediaService, WikipediaService } from "services/wikipedia";
import { IScheduler } from "rxjs/Scheduler";
import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
import { Scheduler } from "rxjs/Rx";

export interface IServices {
    readonly wikipedia: IWikipediaService;
    readonly scheduler: IScheduler;
}

export default function createServices(): IServices {
    return { 
        wikipedia: new WikipediaService(),
        scheduler: Scheduler.async  // setup the default rx scheduler for epics as the async scheduler, to be overriden in tests
    };
}