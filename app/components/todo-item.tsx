import * as React from "react";
import { TodoTextInput } from "./todo-text-input";
import { TodoTypeSelector } from "./todo-type-selector";
import { Todo } from "../containers/todo/state";
import { Button, Label, ListItem } from "semantic-ui-react";
const styles = require("./todo.css");

export interface IProps {
    todo: Todo;
    editTodo: (todo: Todo) => any;
    deleteTodo: (id: number) => any;
}

export interface IState {
    editing: boolean;
    editingType: boolean;
}

export class TodoItem extends React.Component<IProps, IState> {
    constructor(props?: IProps, context?: any) {
        super(props, context);
        this.state = {
            editing: false,
            editingType: false
        };
        this.handleSave = this.handleSave.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    public render() {
        const { todo, deleteTodo } = this.props;
        let element;
        if (this.state.editing) {
            element = (
                <TodoTextInput text={todo.text}
                    editing={this.state.editing}
                    onSave={(text) => this.handleSave(todo.id, text, todo.type, todo.date)} />
            );
        } else {
            element = (
                <label onDoubleClick={this.handleDoubleClick}>
                    {todo.text}
                </label>
            );
        }
        let typeElement;
        if (this.state.editingType) {
            typeElement = <TodoTypeSelector currentType={todo.type} onBlur={() => this.handleBlur()} onSave={(type) => this.handleSave(todo.id, todo.text as string, type, todo.date)} />;
        }
        return (
            <ListItem>
                <div>
                    <button className={"button-image " + todo.type} onClick={() => this.handleTypeClick()}/>
                    {element}
                </div>
                {typeElement}
            </ListItem>
        );
    }

    private handleTypeClick() {
        this.setState({ editingType: true });
    }

    private handleDoubleClick() {
        this.setState({ editing: true });
    }

    private handleSave(id: number, text: string, type: string, date: number) {
        console.log(id);
        if (text.length === 0) {
            this.props.deleteTodo(id);
        } else {
            this.props.editTodo({ id, text, type, date});
        }
        this.setState({ editing: false, editingType: false });
    }

    private handleBlur() {
        console.log("handling blur");
        this.setState({ editing: false, editingType: false });
    }
}
