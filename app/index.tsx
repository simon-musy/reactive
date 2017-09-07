import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactRedux from "react-redux";


// Import semantic UI CSS
const styles = require("semantic-ui-css/semantic.min.css");

// Import datepicker CSS
const datepickerStyles = require("react-datepicker/dist/react-datepicker.css");

// Import the Hot Module Reloading App Container
import { AppContainer } from "react-hot-loader";

// Import our react App container component
import App from "containers/app";

// Create the store
import configureStore from "store";
const store = configureStore();

// This renders our App into the application root element, inside the HMR App Container
// which handles the reloading
const render = (Component: any) => ReactDOM.render(
  <AppContainer>
    <ReactRedux.Provider store={store}>
      <App/>
    </ReactRedux.Provider>
  </AppContainer>,
  document.getElementById("app")
);

render(App);

// Hot Module Replacement API
if (module.hot) {
  // Any change to App class and its imports will be intercepted and handled by this lambda
  module.hot.accept("containers/app", () => {
    const NextApp = require<RequireImport>("containers/app").default;
    render(NextApp);
  });
}
