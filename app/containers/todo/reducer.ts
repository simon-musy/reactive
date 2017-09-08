import { assign } from "lodash";
import { Todo, TodoState } from "./state";
import { Actions, DeleteTodoActionType, AddTodoActionType, EditTodoActionType, EditDateActionType } from "containers/todo/actions";

export const todoReducer = (state: TodoState = TodoState.debug, action: Actions): TodoState => {
    switch (action.type) {

        case DeleteTodoActionType:
            return {
                todos: state.todos.filter(todo => todo.id !== action.payload),
                date: state.date
            };

        case AddTodoActionType:
            return {
                todos: [...state.todos, {
                    id: Math.max.apply(null, state.todos.map(t => t.id)) + 1,
                    text: action.payload,
                    type: "task"
                }],
                date: state.date
            };

        case EditTodoActionType:
            return {
                todos: state.todos.map(todo => todo.id === action.payload.id ? assign({}, todo, { text: action.payload.text, type: action.payload.type }) : todo),
                date: state.date
            };

        case EditDateActionType:
            return {
                todos: state.todos,
                date: action.payload
            };

        default: return state;
    }
};