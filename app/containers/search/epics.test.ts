import {ContentResult, SearchState} from "./state";
import { searchOnInputChangedEpic, searchEpic } from "./epics";
import {searchFulfilled, inputChanged,  search,  Actions} from "./actions";
import { IServices } from "services/services";
import { IWikipediaService } from "services/wikipedia";
import * as Rx from "rxjs";
import { createTestScheduler, frames } from "utils/rx/test-helpers";
import { ActionsObservable } from "redux-observable";
import { MiddlewareAPI } from "redux";
import { createTestAction$FromMarbles, createTestAction$ } from "utils/redux-observable/test-helpers";
import * as TypeMoq from "typemoq";

describe("/app/containers/search/epics", () => {
    // Mock store
    const storeMock = TypeMoq.Mock.ofType<MiddlewareAPI<SearchState>>();
    const store = storeMock.object;

    test("searchOnInputChangedEpic debounces search", () => {
        // Create test scheduler
        const testScheduler = createTestScheduler();

        // Mock services 
        const servicesMock = TypeMoq.Mock.ofType<IServices>();
        servicesMock.setup(m => m.scheduler).returns(() => testScheduler);
        const services = servicesMock.object;

        // Mock input actions stream
        const inputActions = {
            a: inputChanged("r"),
            b: inputChanged("rx"),
            c: inputChanged("rxjs")
        };
        const action$ = createTestAction$FromMarbles<Actions>(testScheduler,
            "-ab" + frames(30) + "-c", inputActions);

        // Apply epic on actions observable
        const resultingAction$ = searchOnInputChangedEpic(action$, store, services);

        // Assert on the resulting actions observable
        const resultActions = {
            b: search("rx"),
            c: search("rxjs")
        };
        testScheduler.expectObservable(resultingAction$).toBe(
            "--" + frames(30) + "b-" + frames(30) + "c", resultActions);

        // Run test
        testScheduler.flush();
    });

    test("searchOnInputChangedEpic doesn't launch unecessary duplicate searches (distinctUntilChanged order)", () => {
        // Create test scheduler
        const testScheduler = createTestScheduler();

        // Mock services 
        const servicesMock = TypeMoq.Mock.ofType<IServices>();
        servicesMock.setup(m => m.scheduler).returns(() => testScheduler);
        const services = servicesMock.object;

         // Mock input actions stream
        const inputActions = {
            a: inputChanged("r"),
            b: inputChanged("rx"),
            c: inputChanged("rxjs")
        };
        const action$ = createTestAction$FromMarbles<Actions>(testScheduler,
            "-ab" + frames(30) + "-cb", inputActions);

        // Apply epic on actions observable
        const resultingAction$ = searchOnInputChangedEpic(action$, store, services);

        // Assert on the resulting actions observable
        const resultActions = {
            b: search("rx")
        };
        testScheduler.expectObservable(resultingAction$).toBe(
            "--" + frames(30) + "b-", resultActions);

        // Run test
        testScheduler.flush();
    });

    test("searchEpic with content", (done) => {
        const searchInput = "rxjs";
        const searchResult = "Reactive programming";
       
        // Mock services 
        const servicesMock = TypeMoq.Mock.ofType<IServices>();
        const wikipediaMock = TypeMoq.Mock.ofType<IWikipediaService>();
        wikipediaMock.setup(m => m.pageContent(searchInput)).returns(() => Rx.Observable.of(searchResult));
        servicesMock.setup(m => m.wikipedia).returns(() => wikipediaMock.object);
        const services = servicesMock.object;

         // Mock input actions stream
        const action$ = createTestAction$<Actions>(search(searchInput));

        // Apply epic on actions observable
        const resultingAction$ = searchEpic(action$, store, services);

        // Assert on the resulting actions observable   
        resultingAction$.subscribe(
            action => expect(action).toEqual(searchFulfilled(new ContentResult(searchResult))), 
            error => fail(error), 
            done
        );
    });
});