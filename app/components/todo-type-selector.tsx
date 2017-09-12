import * as React from "react";
import { Button } from "semantic-ui-react";
const styles = require("./todo.css");

interface TodoTypeSelectorProps {
    onSave: (selectedType: string) => void;
    onBlur: () => void;
    types: string[];
}

export class TodoTypeSelector extends React.Component<TodoTypeSelectorProps, object> {
    constructor(props: TodoTypeSelectorProps, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <div>
                {this.props.types.map(type => <button
                    key={type}
                    className={"button-image " + type}
                    onClick={() => this.props.onSave(type)}/>)}
            </div>
        );
    }
}