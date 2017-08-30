import { TypedAction, createAction } from "utils/redux-observable/typed-action";

// Action names
export const DeleteTodoActionType = "DELETE_TODO";
export const AddTodoActionType = "ADD_TODO";

// Actions
export type DeleteTodoAction = TypedAction<typeof DeleteTodoActionType, number>;
export type AddTodoAction = TypedAction<typeof AddTodoActionType, string>;

export type Actions =
    DeleteTodoAction
    | AddTodoAction;

// Action creators
export const deleteTodoAction = (id: number): DeleteTodoAction => createAction(DeleteTodoActionType, id);

export const addTodoAction = (text: string): AddTodoAction => createAction(AddTodoActionType, text);