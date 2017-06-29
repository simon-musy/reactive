import * as React from "react";
import * as Redux from "redux";
import * as ReduxObservable from "redux-observable";
import * as ReactRedux from "react-redux";
import { SearchContainer } from "containers/search/search";
import { searchReducer} from "containers/search/reducers";
import { searchEpics } from "containers/search/epics";
import WikipediaService from "services/wikipedia";
import { configureStore } from "configure-store";

const store = configureStore<any>(
    Redux.combineReducers({search: searchReducer}), 
    ReduxObservable.combineEpics<any>(searchEpics),
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