export class Todo {
    public id: number;
    public text?: string;
    public type: string;
}

export const todoTypes: string[] = ["task", "task-completed", "event", "note"];

export class TodoState {
    public static debug: TodoState = new TodoState([{id: 1, text: 'Test task', type: "task"}, {id: 2, text: 'Another task', type: "event"}]);

    public constructor(public readonly todos: Todo[]) {
        
    }
}
