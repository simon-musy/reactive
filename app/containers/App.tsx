import * as React from "react";
import * as Redux from "redux";
import * as ReduxObservable from "redux-observable";
import * as ReactRedux from "react-redux";
import { SearchContainer } from "containers/search/search";
import WikipediaService from "services/wikipedia";
import { configureStore } from "configure-store";
import { rootReducer } from "reducers";
import { rootEpic } from "epics";

const store = configureStore<any>(
    rootReducer, 
    rootEpic,
    { wikipedia: new WikipediaService() });

const App = () =>
    (
        <ReactRedux.Provider store={store}>
            <div>
                <SearchContainer />
            </div>
        </ReactRedux.Provider>
    );

export default App;