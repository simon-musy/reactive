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
                {this.props.types.map(type => <button type="submit"
                    key={type}
                    className={"button-image " + type}
                    onClick={() => this.props.onSave(type)}
                    onBlur={() => this.props.onBlur()}
                    autoFocus={type === this.props.types[0]} />)}
                <br />
            </div>
        );
    }
}