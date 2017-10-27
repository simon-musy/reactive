import * as React from "react";
const styles = require("./todo.css");

export default () => (
  <div>
    <h2>Keys</h2>
    <ul>
        <li>
            <div className="button-image task"/>
            <label>Task</label>
        </li>
        <li>
            <div className="button-image task-completed"/>
            <label>Completed task</label>
        </li>
        <li>
            <div className="button-image migrated"/>
            <label>Migrated task</label>
        </li>
        <li>
            <div className="button-image note"/>
            <label>Note</label>
        </li>
        <li>
            <div className="button-image event"/>
            <label>Event</label>
        </li>
    </ul>
  </div>
);