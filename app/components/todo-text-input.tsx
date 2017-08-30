import * as React from "react";

interface TodoTextInputProps {
    onSave: (text: string) => void;
    text?: string;
    placeholder?: string,
    editing?: boolean;
    newTodo?: boolean;
}
interface TodoTextInputState {
    text: string;
}

export class TodoTextInput extends React.Component<TodoTextInputProps, TodoTextInputState> {
    constructor(props: TodoTextInputProps, context: any) {
        super(props, context);
        this.state = {
            text: this.props.text || ""
        };
    }

    public render() {
        return (
            <input
                type="text"
                placeholder={this.props.placeholder}
                autoFocus={true}
                value={this.state.text}
                onChange={this.handleChange.bind(this)}
                onKeyDown={this.handleSubmit.bind(this)} />
        );
    }

    private handleSubmit(e: any) {
        const text = e.target.value.trim();
        if (e.which === 13) {
            this.props.onSave(text);
            if (this.props.newTodo) {
                this.setState({ text: "" });
            }
        }
    }

    private handleChange(e: any) {
        this.setState({ text: e.target.value });
    }
}
