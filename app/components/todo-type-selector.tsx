import * as React from "react";
import { Button, Dropdown } from "semantic-ui-react";
const styles = require("./todo.css");

interface TodoTypeSelectorProps {
    onSave: (selectedType: string) => void;
    onBlur: () => void;
    types: string[];

    currentType: string;
}

export class TodoTypeSelector extends React.Component<TodoTypeSelectorProps, object> {
    constructor(props: TodoTypeSelectorProps, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <Dropdown closeOnBlur={true} autoFocus={true} className={"button-image " + this.props.currentType} defaultOpen onBlur={() => this.props.onBlur()}>
                <Dropdown.Menu>
                    {this.props.types.map(type => <Dropdown.Item key={type} className={"button-image " + type} onClick={() => this.props.onSave(type)}/>)}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}