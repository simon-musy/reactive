import * as React from "react";
import { TodoTextInput } from "./todo-text-input";
import { TodoTypeSelector } from "./todo-type-selector";
import { todoTypes, Todo } from "../containers/todo/state";
import { Button, Label, ListItem } from "semantic-ui-react";
import { MigrationData } from "../containers/todo/actions";
import * as moment from "moment";
import DatePicker from "react-datepicker";
const styles = require("./todo.css");

export interface IProps {
    todo: Todo;
    editTodo: (todo: Todo) => void;
    deleteTodo: (id: number) => void;
    migrateTodo: (migrationData: MigrationData) => void;
}

export interface IState {
    editing: boolean;
    editingType: boolean;
    migrating: boolean;
    migratedTodo?: Todo;
}

export class TodoItem extends React.Component<IProps, IState> {
    constructor(props?: IProps, context?: any) {
        super(props, context);
        this.state = {
            editing: false,
            editingType: false,
            migrating: false
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
        let migratingElement;
        if (this.state.editingType) {
            typeElement = <TodoTypeSelector
                types={this.getOtherTypes(todo.type)}
                onBlur={() => this.handleBlur()}
                onSave={(type) => this.handleTypeChange(todo, type)} />;
        }
        if (this.state.migrating) {
            migratingElement = <DatePicker
                selected={moment(todo.date)}
                onChange={this.handleMigration.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                withPortal />;
        }
        return (
            <ListItem>
                <div>
                    <button className={"button-image " + todo.type} onClick={() => this.handleTypeClick()} />
                    {element}
                </div>
                {typeElement}
                {migratingElement}
            </ListItem>
        );
    }

    private handleTypeClick() {
        this.setState({ editingType: true });
    }

    private handleDoubleClick() {
        this.setState({ editing: true });
    }

    private handleMigration(date: moment.Moment) {
        console.log("MIGRATING");
        this.props.migrateTodo({migratedTodo: this.state.migratedTodo as Todo, date: date.valueOf()});
    }

    private handleTypeChange(todo: Todo, type: string) {
        if (type !== "migrated") {
            this.handleSave(todo.id, todo.text as string, type, todo.date);
        }
        else {
            this.setState({ editing: false, editingType: false, migrating: true, migratedTodo: todo });
        }
    }

    private handleSave(id: number, text: string, type: string, date: number) {
        console.log(id);
        if (text.length === 0) {
            this.props.deleteTodo(id);
        } else {
            this.props.editTodo({ id, text, type, date });
        }
        this.setState({ editing: false, editingType: false });
    }

    private handleBlur() {
        console.log("handling blur");
        this.setState({ editing: false, editingType: false, migrating: false, migratedTodo: undefined });
    }

    private getOtherTypes(type?: string): string[] {
        return todoTypes.filter(t => t !== type);
    }
}
