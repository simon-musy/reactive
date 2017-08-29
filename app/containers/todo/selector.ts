// Redux selectors: any time the store is updated, mapStateToProps will be called. 
// The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
import { MapStateToProps, MapDispatchToPropsFunction } from "react-redux";
import { TodoPageStateProps, TodoPageDispatchProps } from "components/todo-page";
import { AppState } from "../../app-state";
import { Dispatch, bindActionCreators } from "redux";
import { deleteTodoAction } from "containers/todo/actions";

export const mapStateToProps: MapStateToProps<TodoPageStateProps, any> = (state: AppState, ownProps: any) => {
    const pageState = {todos: state.todo.todos};
    console.log(state.todo);
    return pageState;
};

export const mapDispatchToProps: MapDispatchToPropsFunction<TodoPageDispatchProps, any> = (dispatch: Dispatch<any>, ownProps: any) => {
    return bindActionCreators({ deleteTodo: deleteTodoAction }, dispatch);
};