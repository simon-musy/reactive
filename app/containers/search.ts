
import { AppState } from "app-state";
import { SearchStateProps, SearchSuggestionProps, SearchInput, SearchDispatchProps } from "components/search-input";
import { connect, MapStateToProps, MapDispatchToProps, Dispatch, ComponentDecorator, DispatchProp, MapDispatchToPropsFunction } from "react-redux";
import { MiddlewareAPI, bindActionCreators } from "redux";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs";
import { filterOfType, Foobar } from "utils/rx/filterOfType";
import { IServices } from "services/services";
import { createAction, TypedAction } from "utils/redux-observable-helpers";
import { ComponentClass } from "@types/react";
import { Page } from "services/wikipedia";

export class SearchSuggestion {

    public constructor(public readonly title: string,
                       public readonly description: string = "",
                       public readonly thumbnailUrl: string = "") {

    }

    public withDescription(description: string): SearchSuggestion {
        return new SearchSuggestion(this.title, description, this.thumbnailUrl);
    }

    public withThumbnailUrl(thumbnailUrl: string): SearchSuggestion {
        return new SearchSuggestion(this.title, this.description, thumbnailUrl);
    }
}

export type SearchResult = ContentResult | ErrorResult | EmptyResult;

export class ContentResult {
    public kind: "content";
    public constructor(public readonly content: string) { }
}

export class ErrorResult {
    public kind: "error";
    public constructor(public readonly error: string) { }
}

export class EmptyResult {
    public static Instance = new EmptyResult();
    public kind: "empty";
}

export class SearchState {
    public static empty: SearchState = new SearchState("", [], EmptyResult.Instance, false);

    public constructor(public readonly input: string,
                       public readonly suggestions: SearchSuggestion[],
                       public readonly searchResult: SearchResult,
                       public readonly loading: boolean) {
    }

    public withInput(input: string): SearchState {
        return new SearchState(input, this.suggestions, this.searchResult, true);
    }

    public withSuggestions(suggestions: SearchSuggestion[]): SearchState {
        return new SearchState(this.input, suggestions, this.searchResult, false);
    }

    public withSearchResults(results: SearchResult): SearchState {
        return new SearchState(this.input, this.suggestions, results, this.loading);
    }
}

// Action names
const INPUT_CHANGED = "INPUT_CHANGED";
const SEARCH = "SEARCH";
const SEARCH_FULFILLED = "SEARCH_FULFILLED";
const SUGGEST = "SUGGEST";
const SUGGEST_FULFILLED = "SUGGEST_FULFILLED";
const SUGGESTION_SELECTED = "SUGGESTION_SELECTED";

// Actions
class InputChangedAction { public type: "INPUT_CHANGED"; constructor(public input: string) { } }
class SearchAction { public type: "SEARCH"; constructor(public input: string) { } }
class SearchFulfilledAction { public type: "SEARCH_FULFILLED"; constructor(public result: SearchResult) { } }
class SuggestAction { public type: "SUGGEST"; constructor(public input: string) { } }
class SuggestFulfilledAction { public type: "SUGGEST_FULFILLED"; constructor(public suggestions: SearchSuggestion[]) { } }
class SuggestionSelected { public type: "SUGGESTION_SELECTED"; constructor(public suggestion: SearchSuggestion) { } }

type Action = 
InputChangedAction 
| SearchAction 
| SearchFulfilledAction 
| SuggestAction 
| SuggestFulfilledAction 
| SuggestionSelected;

const foobar = new Foobar();

// Action creators
const inputChanged = (input: string) => new InputChangedAction(input);
const search = (input: string) => new SearchAction(input);
const suggest = (input: string) => new SuggestAction(input);
const suggestionSelected = (suggestion: SearchSuggestionProps) => new SuggestionSelected(
    new SearchSuggestion(suggestion.title, suggestion.description, suggestion.image));
const suggestFulfilled = (input: SearchSuggestion[]) => new SuggestFulfilledAction(input);
const searchFulfilled = (response: SearchResult) => new SearchFulfilledAction(response);

// Reducer
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
export const searchReducer = (state: SearchState = SearchState.empty, action: Action): SearchState => {
    switch (action.type) {
        case INPUT_CHANGED:
            return state.withInput(action.input);
        case SEARCH_FULFILLED:
            return state.withSearchResults(action.result);
        case SUGGEST_FULFILLED:
            return state.withSuggestions(action.suggestions);
        default: return state;
    }
};

// Epics
const SearchDelay = 300;
const searchOnInputChangedEpic =
    (action$: Observable<Action>,
     store: MiddlewareAPI<SearchState>): Observable<Action> => {
        return action$
            .filterOfType(InputChangedAction)
            .debounceTime(SearchDelay)
            .map(a => a.input)
            .map(inputChanged);
    };

const SuggestDelay = 100;
const suggestOnInputChangedEpic =
    (action$: Observable<Action>,
     store: MiddlewareAPI<SearchState>): Observable<Action> => {
        return action$
            .filterOfType(InputChangedAction)
            .debounceTime(SuggestDelay)
            .map(a => a.input)
            .map(suggest);
    };

const changeInputOnSuggestionSelectedEpic =
    (action$: Observable<Action>,
     store: MiddlewareAPI<SearchState>): Observable<Action> => {
        return action$
            .filterOfType(SuggestionSelected)
            .map(s => s.suggestion.title)
            .map(inputChanged);
    };

const searchEpic =
    (action$: Observable<Action>,
     store: MiddlewareAPI<SearchState>, services: IServices): Observable<Action> => {
        return action$
            .filterOfType(SearchAction)
            .map(a => a.input)
            .distinctUntilChanged()
            .switchMap(input =>
                services.wikipedia.pageContent(input)
                    .map(p => new ContentResult(p))
                    .catch((error: Error) => {
                        console.log("search caught error " + error);
                        return Observable.of<SearchResult>(new ErrorResult(error.message));
                    }))
            .map(searchFulfilled);
    };

const suggestEpic =
    (action$: Observable<Action>,
     store: MiddlewareAPI<SearchState>,
     services: IServices): Observable<Action> => {
        return action$
            .filterOfType(SuggestAction)
            .map(a => a.input)
            .distinctUntilChanged()
            .switchMap(input =>
                services.wikipedia.pages(input)
                    .map(pages => pages.map(createPageSuggestion)).catch((error: Error) => {
                        console.log("suggest caught error " + error);
                        return Observable.of<SearchSuggestion[]>([]);
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

export const searchEpics = combineEpics<any>(searchOnInputChangedEpic, suggestOnInputChangedEpic, searchEpic, suggestEpic, changeInputOnSuggestionSelectedEpic);

// Redux selectors: any time the store is updated, mapStateToProps will be called. 
// The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
const mapStateToProps: MapStateToProps<SearchStateProps, any> = (state: AppState, ownProps: any) => {
    return {
        suggestions: state.search.suggestions.map((s, idx) => {
            const suggestion: SearchSuggestionProps = { id: idx, title: s.title, description: s.description, image: s.thumbnailUrl };
            return suggestion;
        }),
        input: state.search.input,
        error: (state.search.searchResult instanceof ErrorResult) ? state.search.searchResult.error : "",
        loading: state.search.loading,
        menuOpen: state.search.suggestions.length > 0
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<SearchDispatchProps, any> = (dispatch: Dispatch<any>, ownProps: any) => {
    return bindActionCreators({ inputChanged, suggestionSelected }, dispatch);
};

// Component declaration
export const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(SearchInput);
export default SearchContainer; 