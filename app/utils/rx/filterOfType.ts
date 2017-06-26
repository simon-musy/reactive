import { Observable } from "rxjs/Observable";

export class Foobar {
  
}

export function filterOfType<T>(this: Observable<any>, constructor: { new (...args: any[]): T }): Observable<T> {
    return this.filter(a => a instanceof constructor)
            .map(t => t as T);
}

// Add the operator to the Observable prototype:
Observable.prototype.filterOfType = filterOfType;

// Extend the TypeScript interface for Observable to include the operator:
declare module "rxjs/Observable" {
  interface Observable<T> {
    filterOfType: typeof filterOfType;
  }
}