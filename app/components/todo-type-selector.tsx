import * as React from "react";
import { todoTypes } from "../containers/todo/state";
import { Button } from "semantic-ui-react";
const styles = require("./todo.css");

interface TodoTypeSelectorProps {
    onSave: (selectedType: string) => void;
    onBlur: () => void;
    currentType?: string;
}

export class TodoTypeSelector extends React.Component<TodoTypeSelectorProps, object> {
    constructor(props: TodoTypeSelectorProps, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <div>
                {this.getOtherTypes(this.props.currentType).map(type => <button
                    key={type}
                    className={"button-image " + type}
                    onClick={() => this.props.onSave(type)}/>)}
            </div>
        );
    }

    private getOtherTypes(type?: string): string[] {
        return todoTypes.filter(t => t !== type);
    }
}