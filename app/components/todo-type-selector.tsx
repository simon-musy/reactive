import * as React from "react";
import { todoTypes } from "../containers/todo/state";
import { Button } from "semantic-ui-react";

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
            <Button.Group autoFocus={true} onBlur={() => this.props.onBlur()}>
                {this.getOtherTypes(this.props.currentType).map(type => <Button
                    key={type}
                    circular
                    onClick={() => this.props.onSave(type)}>{type}</Button>)}
            </Button.Group>
        );
    }

    private getOtherTypes(type?: string): string[] {
        return todoTypes.filter(t => t !== type);
    }
}