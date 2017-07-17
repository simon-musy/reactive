import * as Rx from "rxjs";
export const createTestScheduler = () => new Rx.TestScheduler((actual, expected) => expect(actual).toEqual(expected));

export function frames(n: number, unit: string = "-"): string {
    return n === 1 ? unit : unit + frames(n - 1, unit);
}