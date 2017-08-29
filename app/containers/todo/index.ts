// Component declaration
import { TodoPage } from "components/todo-page";
import { mapStateToProps, mapDispatchToProps } from "containers/todo/selector";
import { connect } from "react-redux";

export const TodoContainer = connect(mapStateToProps, mapDispatchToProps)(TodoPage);
export default TodoContainer; 