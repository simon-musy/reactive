import { Action, applyMiddleware, createStore, Reducer, Store, ReducersMapObject } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import { createEpicMiddleware, Epic } from "redux-observable";
import { IServices } from "services/services";
import createRootReducer from "reducers";
import createServices from "services/services-factory";
import createRootEpic from "epics";
import { routerMiddleware } from "react-router-redux";
import { browserHistory } from "browser-history";

export default function configureStore<S>(): Store<S> {
    const rootEpic = createRootEpic();
    const rootReducer = createRootReducer();
    const services = createServices();
    const epicMiddleware = createEpicMiddleware(rootEpic, { dependencies: services });
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(epicMiddleware, routerMiddleware(browserHistory), logger))) as Store<S>;

    if (module.hot) {
        // enable hot-reload for reducers
        module.hot.accept("reducers", () => {
            const createRootReducer = require<RequireImport>("reducers").default;
            store.replaceReducer(createRootReducer());
        });
        // enable hot-reload for epics
        module.hot.accept("epics", () => {
            const createRootEpic = require<RequireImport>("epics").default;
            epicMiddleware.replaceEpic(createRootEpic());
        });
    }

    return store;
}