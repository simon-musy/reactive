import { Action, applyMiddleware, createStore, Reducer, Store, ReducersMapObject } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import createRootReducer from "reducers";
import { routerMiddleware } from "react-router-redux";
import { browserHistory } from "browser-history";

export default function configureStore<S>(): Store<S> {
    const rootReducer = createRootReducer();
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(routerMiddleware(browserHistory), logger))) as Store<S>;

    if (module.hot) {
        // enable hot-reload for reducers
        module.hot.accept("reducers", () => {
            const createRootReducer = require<RequireImport>("reducers").default;
            store.replaceReducer(createRootReducer());
        });
    }

    return store;
}