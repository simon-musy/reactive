import { TypedAction, createAction } from "utils/redux-observable/typed-action";
import { Todo } from "./state";

// Action names
export const DeleteTodoActionType = "DELETE_TODO";
export const AddTodoActionType = "ADD_TODO";
export const EditTodoActionType = "EDIT_TODO";

// Actions
export type DeleteTodoAction = TypedAction<typeof DeleteTodoActionType, number>;
export type AddTodoAction = TypedAction<typeof AddTodoActionType, string>;
export type EditTodoAction = TypedAction<typeof EditTodoActionType, Todo>;

export type Actions =
    DeleteTodoAction
    | AddTodoAction
    | EditTodoAction;

// Action creators
export const deleteTodoAction = (id: number): DeleteTodoAction => createAction(DeleteTodoActionType, id);
export const addTodoAction = (text: string): AddTodoAction => createAction(AddTodoActionType, text);
export const editTodoAction = (item: Todo): EditTodoAction => createAction(EditTodoActionType, item);
