import {Action, applyMiddleware, createStore, Reducer, Store} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import logger from "redux-logger";
import {createEpicMiddleware, Epic} from "redux-observable";
import {IServices} from "services/services";

export function configureStore<S>(rootReducer: Reducer<S>, rootEpic: Epic<Action, S>, services: IServices): Store<S> {
    return createStore(rootReducer, composeWithDevTools(
        applyMiddleware(createEpicMiddleware(rootEpic, {dependencies: services}), logger)));
}