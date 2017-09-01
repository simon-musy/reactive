import * as React from "react";
import { TodoTextInput } from "./todo-text-input";
import { Todo, TodoType } from "../containers/todo/state";
import { Button, Label, ListItem } from "semantic-ui-react";

export interface IProps {
    todo: Todo;
    editTodo: (todo: Todo) => any;
    deleteTodo: (id: number) => any;
}

export interface IState {
    editing: boolean;
}

export class TodoItem extends React.Component<IProps, IState> {
    constructor(props?: IProps, context?: any) {
        super(props, context);
        this.state = {
            editing: false
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
                    onSave={(text) => this.handleSave(todo.id, text, todo.type)} />
            );
        } else {
            element = (
                <Label size="big" onDoubleClick={this.handleDoubleClick}>
                    {todo.text}
                </Label>
            );
        }

        return (
            <ListItem>
                <div>
                    <Button circular icon={this.todoTypeToIcon(todo.type)} onClick={() => deleteTodo(todo.id)} />
                    {element}
                </div>
            </ListItem>
        );
    }

    private todoTypeToIcon(type: TodoType): string{
        switch (type) {
            case TodoType.Task:
                return "theme";
            case TodoType.Event:
                return "unhide";
            default:
                return "google";
        }
    }

    private handleDoubleClick() {
        this.setState({ editing: true });
    }

    private handleSave(id: number, text: string, type: TodoType) {
        if (text.length === 0) {
            this.props.deleteTodo(id);
        } else {
            this.props.editTodo({ id, text, type });
        }
        this.setState({ editing: false });
    }
}
