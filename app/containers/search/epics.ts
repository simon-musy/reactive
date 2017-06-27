import { Page } from "services/wikipedia";
import { SearchSuggestion, ErrorResult, SearchResult, ContentResult } from "containers/search/state";
import { IServices } from "services/services";
import { SearchState } from "containers/search/state";
import { ActionsObservable } from "redux-observable";
import { Actions, InputChangedAction, InputChangedActionType, inputChanged, suggest, SuggestionSelectedAction, SuggestionSelectedActionType, SearchAction, SearchActionType, searchFulfilled, SuggestAction, SuggestActionType, suggestFulfilled } from "containers/search/actions";
import { MiddlewareAPI } from "redux";
import * as Rx from "rxjs";
import { combineEpics } from "redux-observable";
import { actionsOfType } from "utils/redux-observable-helpers";
const ensureImport: any = actionsOfType;

const SearchDelay = 300;
const searchOnInputChangedEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>): Rx.Observable<Actions> => {
        return action$
            .actionsOfType<InputChangedAction>(InputChangedActionType)
            .map(a => a.payload)
            .debounceTime(SearchDelay)
            .map(inputChanged);
    };

const SuggestDelay = 100;
const suggestOnInputChangedEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>): Rx.Observable<Actions> => {
        return action$
            .actionsOfType<InputChangedAction>(InputChangedActionType)
            .debounceTime(SuggestDelay)
            .map(a => a.payload)
            .map(suggest);
    };

const changeInputOnSuggestionSelectedEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>): Rx.Observable<Actions> => {
        return action$
            .actionsOfType<SuggestionSelectedAction>(SuggestionSelectedActionType)
            .map(s => s.payload.title)
            .map(inputChanged);
    };

const searchEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>, services: IServices): Rx.Observable<Actions> => {
        return action$
            .actionsOfType<SearchAction>(SearchActionType)
            .map(a => a.payload)
            .distinctUntilChanged()
            .switchMap(input =>
                services.wikipedia.pageContent(input)
                    .map(p => new ContentResult(p))
                    .catch((error: Error) => {
                        console.log("search caught error " + error);
                        return Rx.Observable.of<SearchResult>(new ErrorResult(error.message));
                    }))
            .map(searchFulfilled);
    };

const suggestEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>,
     services: IServices): Rx.Observable<Actions> => {
        return action$
            .actionsOfType<SuggestAction>(SuggestActionType)
            .map(a => a.payload)
            .distinctUntilChanged()
            .switchMap(input =>
                services.wikipedia.pages(input)
                    .map(pages => pages.map(createPageSuggestion)).catch((error: Error) => {
                        console.log("suggest caught error " + error);
                        return Rx.Observable.of<SearchSuggestion[]>([]);
                    }))
            .map(suggestFulfilled);
    };

function createPageSuggestion(page: Page): SearchSuggestion {
    let suggestion = new SearchSuggestion(page.title);
    if (page.terms && page.terms.description.length > 0) {
        suggestion = suggestion.withDescription(page.terms.description[0]);
    }
    if (page.thumbnail) {
        suggestion = suggestion.withThumbnailUrl(page.thumbnail.source);
    }
    return suggestion;
}

export const searchEpics = combineEpics(searchOnInputChangedEpic, suggestOnInputChangedEpic, searchEpic, suggestEpic, changeInputOnSuggestionSelectedEpic);
