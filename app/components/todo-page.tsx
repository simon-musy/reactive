import * as React from "react";
import * as _ from "lodash";
import { Todo } from "../containers/todo/state";
import { TodoTextInput } from "./todo-text-input";
import { TodoItem } from "./todo-item";
import { List } from "semantic-ui-react";
import { MigrationData } from "../containers/todo/actions";
import * as moment from "moment";
import DatePicker from "react-datepicker";

export interface TodoPageStateProps {
    readonly todos: Todo[];
    readonly date: number;
}

export interface TodoPageDispatchProps {
    deleteTodo: (id: number) => void;
    addTodo: (todo: Todo) => void;
    editTodo: (item: Todo) => void;
    editDate: (date: number) => void;
    migrateTodo: (migrationData: MigrationData) => void;
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
                <TodoTextInput
                    newTodo
                    onSave={this.handleSave.bind(this)}
                    placeholder="What needs to be done?" />
                <ul>
                    {this.props.todos.map(todo =>
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            editTodo={this.props.editTodo}
                            deleteTodo={this.props.deleteTodo}
                            migrateTodo={this.props.migrateTodo} />)}
                </ul>
                <DatePicker
                    selected={moment(this.props.date)}
                    onChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
    private handleChange(date: moment.Moment) {
        this.props.editDate(date.valueOf());
    }

    private handleSave(text: string, type: string) {
        if (text.length !== 0) {
            this.props.addTodo({type, date: this.props.date, text, id: 0});
        }
    }
}
