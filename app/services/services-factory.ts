import {WikipediaService} from "./wikipedia";
import {IServices} from "./services";
import * as Rx from "rxjs";

export default function createServices(): IServices {
    return { 
        wikipedia: new WikipediaService(),
        scheduler:  Rx.Scheduler.async // setup the default rx scheduler for epics as the async scheduler, to be overriden in tests
    };
}