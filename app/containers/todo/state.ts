export class Todo {
    public id?: number;
    public text?: string;
}
export class TodoState {
    public static debug: TodoState = new TodoState([{id: 1, text: 'Test task'}, {id: 2, text: 'Another task'}]);

    public constructor(public readonly todos: Todo[]) {
        
    }
}
