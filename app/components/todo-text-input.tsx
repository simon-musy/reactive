import * as React from "react";
import { Button, Input } from "semantic-ui-react";
import { TodoTypeSelector } from "./todo-type-selector";

interface TodoTextInputProps {
    onSave: (text: string, type: string) => void;
    text?: string;
    placeholder?: string;
    editing?: boolean;
    newTodo?: boolean;
}
interface TodoTextInputState {
    text: string;
    editingType: boolean;
    type?: string;
}

const defaultState = { text: "", type: undefined, editingType: false };

export class TodoTextInput extends React.Component<TodoTextInputProps, TodoTextInputState> {
    constructor(props: TodoTextInputProps, context: any) {
        super(props, context);
        this.state = {
            text: this.props.text || "",
            editingType: false
        };
    }

    public render() {
        let typeElement;
        let inputElement = <br/>;
        if (this.props.newTodo && this.state.editingType) {
            typeElement = <TodoTypeSelector
                types={["task", "event", "note"]}
                onBlur={this.handleBlur.bind(this)}
                onSave={(type) => this.handleTypeChange(type)} 
                currentType={"add"}/>;
        }
        else if (this.props.newTodo && this.state.type !== undefined) {
            typeElement = <div className={"button-image " + this.state.type} />;
        }
        else if (this.props.newTodo) {
            typeElement = <Button size="mini" circular icon="add" onClick={() => this.handleTypeClick()} />;
        }
        if (this.state.type !== undefined || !this.props.newTodo) {
            inputElement = <Input
                type="text"
                placeholder={this.props.placeholder}
                autoFocus={true}
                value={this.state.text}
                onChange={this.handleChange.bind(this)}
                onKeyDown={this.handleSubmit.bind(this)}
                onBlur={this.handleBlur.bind(this)} />;
        }
        return (
            <div>
                {typeElement}
                {inputElement}
            </div>
        );
    }

    private handleTypeClick() {
        this.setState({ editingType: true });
    }

    private handleSubmit(e: any) {
        const text = e.target.value.trim();
        if (e.which === 13) {
            this.props.onSave(text, this.state.type as string);
            if (this.props.newTodo) {
                this.setState(defaultState);
            }
        }
    }

    private handleChange(e: any) {
        this.setState({ text: e.target.value });
    }

    private handleBlur(e: any) {
        if (!this.props.newTodo) {
            this.props.onSave(e.target.value, this.state.type as string);
        }
        else {
            this.setState(defaultState);
        }
    }

    private handleTypeChange(type: string) {
        this.setState({ editingType: false, type });
    }
}
