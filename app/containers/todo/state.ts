import * as moment from "moment";

export class Todo {
    public id: number;
    public text?: string;
    public type: string;
}

export const todoTypes: string[] = ["task", "task-completed", "event", "note"];

export class TodoState {
    public static debug: TodoState = new TodoState([
        { id: 1, text: 'Task', type: "task" },
        { id: 2, text: 'Completed task', type: "task-completed" },
        { id: 3, text: 'Event', type: "event" },
        { id: 4, text: 'Note', type: "note" }
    ], moment.now());

    public constructor(public readonly todos: Todo[], public readonly date: number) {

    }
}
