import {TypedAction, createAction} from "utils/redux-observable/typed-action";

// Action names
export const DeleteTodoActionType = "DELETE";

// Actions
export type DeleteTodoAction = TypedAction<typeof DeleteTodoActionType, number>;

export type Actions =
    DeleteTodoAction;

// Action creators
export const deleteTodoAction = (id: number): DeleteTodoAction => createAction(DeleteTodoActionType, id);