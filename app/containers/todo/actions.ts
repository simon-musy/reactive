import { TypedAction, createAction } from "utils/redux-observable/typed-action";
import { Todo } from "./state";

// Payload
export interface MigrationData {
    migratedTodo: Todo;
    date: number;
}

// Action names
export const DeleteTodoActionType = "DELETE_TODO";
export const AddTodoActionType = "ADD_TODO";
export const EditTodoActionType = "EDIT_TODO";
export const EditDateActionType = "EDIT_DATE";
export const MigrateTodoActionType = "MIGRATE_TODO";

// Actions
export type DeleteTodoAction = TypedAction<typeof DeleteTodoActionType, number>;
export type AddTodoAction = TypedAction<typeof AddTodoActionType, Todo>;
export type EditTodoAction = TypedAction<typeof EditTodoActionType, Todo>;
export type EditDateAction = TypedAction<typeof EditDateActionType, number>;
export type MigrateTodoAction = TypedAction<typeof MigrateTodoActionType, MigrationData>;

export type Actions =
    DeleteTodoAction
    | AddTodoAction
    | EditTodoAction
    | EditDateAction
    | MigrateTodoAction;

// Action creators
export const deleteTodoAction = (id: number): DeleteTodoAction => createAction(DeleteTodoActionType, id);
export const addTodoAction = (todo: Todo): AddTodoAction => createAction(AddTodoActionType, todo);
export const editTodoAction = (item: Todo): EditTodoAction => createAction(EditTodoActionType, item);
export const editDateAction = (date: number): EditDateAction => createAction(EditDateActionType, date);
export const migrateTodoAction = (data: MigrationData): MigrateTodoAction => createAction(MigrateTodoActionType, data);
