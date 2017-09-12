import * as moment from "moment";

export class Todo {
    public id: number;
    public text?: string;
    public type: string;
    public date: number;
}

export const todoTypes: string[] = ["task", "task-completed", "event", "note", "migrated"];

export class TodoState {
    public static debug: TodoState = new TodoState([
        { id: 1, text: 'Task', type: "task", date: moment(moment.now()).startOf("day").valueOf() },
        { id: 2, text: 'Completed task', type: "task-completed", date: moment(moment.now()).startOf("day").valueOf() },
        { id: 3, text: 'Event', type: "event", date: moment(moment.now()).startOf("day").valueOf() },
        { id: 4, text: 'Note', type: "note", date: moment(moment.now()).startOf("day").valueOf() }
    ], moment(moment.now()).startOf("day").valueOf());

    public constructor(public readonly todos: Todo[], public readonly date: number) {

    }
}
