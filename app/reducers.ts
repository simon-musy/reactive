import * as Redux from "redux";
import { todoReducer } from "containers/todo/reducer";
import { Reducer } from "redux";

export default function createRootReducer(): Reducer<any> {
    return Redux.combineReducers({ todo: todoReducer });
}