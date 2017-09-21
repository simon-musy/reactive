import * as React from "react";
import { List, ListItem } from "semantic-ui-react";
const styles = require("./todo.css");

export default () => (
  <div>
    <h2>Keys</h2>
    <List>
        <ListItem>
            <div className="button-image task"/>
            <label>Task</label>
        </ListItem>
        <ListItem>
            <div className="button-image task-completed"/>
            <label>Completed task</label>
        </ListItem>
        <ListItem>
            <div className="button-image migrated"/>
            <label>Migrated task</label>
        </ListItem>
        <ListItem>
            <div className="button-image note"/>
            <label>Note</label>
        </ListItem>
        <ListItem>
            <div className="button-image event"/>
            <label>Event</label>
        </ListItem>
    </List>
  </div>
);