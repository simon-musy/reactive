import * as React from "react";
import { TodoTextInput } from "./todo-text-input";
import { Todo } from "../containers/todo/state";
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
                    onSave={(text) => this.handleSave(todo.id, text)} />
            );
        } else {
            element = (
                <div>
                    <Label onDoubleClick={this.handleDoubleClick}>
                        {todo.text}
                    </Label>

                    <Button size="mini" onClick={() => deleteTodo(todo.id)}>X</Button>
                </div>
            );
        }

        return (
            <ListItem>
                {element}
            </ListItem>
        );
    }

    private handleDoubleClick() {
        this.setState({ editing: true });
    }

    private handleSave(id: number, text: string) {
        if (text.length === 0) {
            this.props.deleteTodo(id);
        } else {
            this.props.editTodo({ id, text });
        }
        this.setState({ editing: false });
    }
}
