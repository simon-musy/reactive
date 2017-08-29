import * as React from "react";
import * as _ from "lodash";
import { Todo } from "../containers/todo/state";

export interface TodoPageStateProps {
    readonly todos: Todo[];
}

export interface TodoPageDispatchProps {
    deleteTodo: (id: any) => void;
}

export interface TodoPageProps extends TodoPageStateProps, TodoPageDispatchProps {
}

function createMarkup(html: string) {
    return { __html: html };
}


export class TodoPage extends React.Component<TodoPageProps, any> {
    public props: TodoPageProps;

    constructor(props: TodoPageProps) {
        super(props);
        this.props = props;
    }

    public render() {
        console.log(this.props);
        return (
            <div>
                {this.props.todos.map(todo => <div key={todo.id}>{todo.text}<button onClick={() => this.props.deleteTodo(todo.id)}>delete</button></div>)}
            </div>
        );
    }
}
