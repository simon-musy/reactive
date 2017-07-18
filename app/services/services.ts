import { IWikipediaService, WikipediaService } from "services/wikipedia";
import { IScheduler } from "rxjs/Scheduler";

export interface IServices {
    readonly wikipedia: IWikipediaService;
    readonly scheduler: IScheduler;
}

