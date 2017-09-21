import * as React from "react";
import * as Redux from "redux";
import * as ReduxObservable from "redux-observable";
import { ConnectedRouter } from "react-router-redux";
import { Route, Link } from "react-router-dom";
import { browserHistory } from "browser-history";
import { TodoContainer } from "containers/todo/index";
import { Grid, Icon, Menu, Segment } from "semantic-ui-react";
import Keys from "components/keys-page";


const App = () =>
    (
        <ConnectedRouter history={browserHistory}>
            <Grid columns="equal">
                <Grid.Row stretched>
                    <Grid.Column width={3}>
                        <Menu vertical size="mini">
                            <Menu.Item as={Link} to="/">
                                <Icon name="list layout"/>
                                 Home
                            </Menu.Item>
                            <Menu.Item as={Link} to="/keys">
                                <Icon name="map signs"/>
                                Keys
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Segment>
                            <Route exact path="/" component={TodoContainer}/>
                            <Route exact path="/keys" component={Keys} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </ConnectedRouter>
    );

export default App;