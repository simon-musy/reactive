import {MapStateToProps} from "react-redux";
import {Action, MiddlewareAPI} from "redux";
import {Observable} from "rxjs/observable";

export interface TypedAction<P> extends Action {
    payload: P;
    error?: boolean;
    meta?: {};
}

export function createAction<P>(type: string, payload: P): TypedAction<P> {
    return ({type, payload});
}
