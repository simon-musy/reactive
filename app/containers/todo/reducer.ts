import * as _ from "lodash";
import { TodoState } from "containers/todo/state";
import { Actions, DeleteTodoActionType} from "containers/todo/actions";

export const todoReducer = (state: TodoState = TodoState.debug, action: Actions): TodoState => {
    switch (action.type) {
        case DeleteTodoActionType:
            return {todos: state.todos.filter(todo => todo.id != action.payload)};
        default: return state;
    }
};