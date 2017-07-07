import * as ReduxObservable from "redux-observable";
import { searchEpics } from "containers/search/epics";
import { Epic } from "redux-observable";

export default function createRootEpic(): any {
    return ReduxObservable.combineEpics<any>(searchEpics);
}