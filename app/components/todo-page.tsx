import * as React from "react";
import * as _ from "lodash";
import { Todo } from "../containers/todo/state";
import { TodoTextInput } from "./todo-text-input";
import { TodoItem } from "./todo-item";
import { List } from "semantic-ui-react";
import * as moment from "moment";
import DatePicker from "react-datepicker";

export interface TodoPageStateProps {
    readonly todos: Todo[];
}

export interface TodoPageDispatchProps {
    deleteTodo: (id: number) => void;
    addTodo: (text: string) => void;
    editTodo: (item: Todo) => void;
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
        this.state = {
            startDate: moment()
        };
    }

    public render() {
        console.log(this.props);
        return (
            <div>
                <TodoTextInput
                    newTodo
                    onSave={this.handleSave.bind(this)}
                    placeholder="What needs to be done?" />
                <List>
                    {this.props.todos.map(todo =>
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            editTodo={this.props.editTodo}
                            deleteTodo={this.props.deleteTodo} />)}
                </List>
                <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }
    private handleChange(date: moment.Moment) {
        this.setState({
            startDate: date
        });
    }

    private handleSave(text: string) {
        if (text.length !== 0) {
            this.props.addTodo(text);
        }
    }
}
