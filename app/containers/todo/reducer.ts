import { assign } from "lodash";
import { Todo, TodoState } from "./state";
import { Actions, DeleteTodoActionType, AddTodoActionType, EditTodoActionType } from "containers/todo/actions";

export const todoReducer = (state: TodoState = TodoState.debug, action: Actions): TodoState => {
    switch (action.type) {

        case DeleteTodoActionType:
            return { todos: state.todos.filter(todo => todo.id !== action.payload) };

        case AddTodoActionType:
            return {
                todos: [...state.todos, {
                    id: Math.max.apply(null, state.todos.map(t => t.id)) + 1,
                    text: action.payload
                }]
            };

        case EditTodoActionType:
            return {
                todos: state.todos.map(todo => todo.id === action.payload.id ? assign({}, todo, { text: action.payload.text }) : todo)
            };

        default: return state;
    }
};