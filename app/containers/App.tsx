import * as React from "react";
import * as Redux from "redux";
import * as ReduxObservable from "redux-observable";
import { SearchContainer } from "containers/search/search";


const App = () =>
    (
        <div>
            <SearchContainer />
        </div>
    );

export default App;