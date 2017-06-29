import * as ReduxObservable from "redux-observable";
import { searchEpics } from "containers/search/epics";

export const rootEpic = ReduxObservable.combineEpics<any>(searchEpics)