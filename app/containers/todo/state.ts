export class Todo {
    public id: number;
    public text?: string;
    public type: TodoType;
}

export enum TodoType {
    Task,
    TaskCompleted,
    Event,
    EventCompleted,
    Note

}
export class TodoState {
    public static debug: TodoState = new TodoState([{id: 1, text: 'Test task', type: TodoType.Task}, {id: 2, text: 'Another task', type: TodoType.Event}]);

    public constructor(public readonly todos: Todo[]) {
        
    }
}
