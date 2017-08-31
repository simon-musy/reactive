import * as _ from "lodash";
import { TodoState } from "containers/todo/state";
import { Actions, DeleteTodoActionType, AddTodoActionType } from "containers/todo/actions";

export const todoReducer = (state: TodoState = TodoState.debug, action: Actions): TodoState => {
    switch (action.type) {
        case DeleteTodoActionType:
            return { todos: state.todos.filter(todo => todo.id != action.payload) };
        case AddTodoActionType:
            return {
                todos: [...state.todos, {
                    id: Math.max.apply(null, state.todos.map(t => t.id)) + 1,
                    text: action.payload
                }]
            };
        default: return state;
    }
};