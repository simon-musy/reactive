import * as React from "react";
import * as Redux from "redux";
import * as ReduxObservable from "redux-observable";
import { ConnectedRouter } from "react-router-redux";
import { Route } from "react-router";
import { browserHistory } from "browser-history";
import { TodoContainer } from "containers/todo/index";


const App = () =>
    (
        <ConnectedRouter history={browserHistory}>
            <div>
                <Route exact path="/" component={TodoContainer}/>
            </div>
        </ConnectedRouter>
    );

export default App;