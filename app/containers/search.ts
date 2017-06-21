import { AppState } from "app-state";
import { SearchStateProps, SearchSuggestionProps, SearchInput, SearchDispatchProps } from "components/search-input";
import { connect, MapStateToProps, MapDispatchToProps, Dispatch, ComponentDecorator, DispatchProp, MapDispatchToPropsFunction } from "react-redux";
import { Action, MiddlewareAPI, bindActionCreators } from "redux";
import { ActionsObservable, combineEpics } from "redux-observable";
import * as Rx from "rxjs";
import { IServices } from "services/services";
import { createAction, TypedAction } from "utils/redux-observable-helpers";
import { ComponentClass } from "@types/react";

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

export interface ISearchResults {
    content: string;
    error: string;
    hasError(): boolean;
    hasContent(): boolean;
    isEmpty(): boolean;
}

export class ContentResult implements ISearchResults {
    public error: string = "";
    public constructor(public readonly content: string) { }
    public hasError() { return false; }
    public hasContent() { return true; }
    public isEmpty() { return false; }
}

export class ErrorResult implements ISearchResults {
    public content: string = "";
    public constructor(public readonly error: string) { }
    public hasError() { return true; }
    public hasContent() { return true; }
    public isEmpty() { return false; }
}

export class EmptyResult implements ISearchResults {
    public static Instance = new EmptyResult();
    public content = "";
    public error = "";
    public hasError() { return false; }
    public hasContent() { return false; }
    public isEmpty() { return true; }
}

export class SearchState {
    public static empty: SearchState = new SearchState("", [], EmptyResult.Instance, false);

    public constructor(public readonly input: string,
        public readonly suggestions: SearchSuggestion[],
        public readonly searchResults: ISearchResults,
        public readonly loading: boolean) {
    }

    public withInput(input: string): SearchState {
        return new SearchState(input, this.suggestions, this.searchResults, true);
    }

    public withSuggestions(suggestions: SearchSuggestion[]): SearchState {
        return new SearchState(this.input, suggestions, this.searchResults, false);
    }

    public withSearchResults(results: ISearchResults): SearchState {
        return new SearchState(this.input, this.suggestions, results, this.loading);
    }
}

// Actions
const INPUT_CHANGED = "INPUT_CHANGED";
const SEARCH = "SEARCH";
const SEARCH_FULFILLED = "SEARCH_FULFILLED";
const SUGGEST = "SUGGEST";
const SUGGEST_FULFILLED = "SUGGEST_FULFILLED";
const SUGGESTION_SELECTED = "SUGGESTION_SELECTED";

// Action creators
const inputChanged = (input: string) => createAction(INPUT_CHANGED, input);
const search = (input: string) => createAction(SEARCH, input);
const suggest = (input: string) => createAction(SUGGEST, input);
const suggestionSelected = (suggestion: SearchSuggestionProps) => createAction<SearchSuggestion>(SUGGESTION_SELECTED,
    new SearchSuggestion(suggestion.title, suggestion.description, suggestion.image));
const suggestFulfilled = (input: SearchSuggestion[]) => createAction(SUGGEST_FULFILLED, input);
const searchFulfilled = (response: ISearchResults) => createAction(SEARCH_FULFILLED, response);

// Reducer
export const searchReducer = (state: SearchState = SearchState.empty, action: Action): SearchState => {
    switch (action.type) {
        case INPUT_CHANGED:
            return state.withInput((action as TypedAction<string>).payload);
        case SEARCH_FULFILLED:
            return state.withSearchResults((action as TypedAction<ISearchResults>).payload);
        case SUGGEST_FULFILLED:
            return state.withSuggestions((action as TypedAction<SearchSuggestion[]>).payload);
        default:
            return state;
    }
};

// Epics
const SearchDelay = 300;
const searchOnInputChangedEpic =
    (action$: ActionsObservable<TypedAction<string>>,
     store: MiddlewareAPI<SearchState>): Rx.Observable<Action> => {
        return action$
            .ofType(INPUT_CHANGED)
            .debounceTime(SearchDelay)
            .map(a => search(a.payload));
    };

const SuggestDelay = 100;
const suggestOnInputChangedEpic =
    (action$: ActionsObservable<TypedAction<string>>,
     store: MiddlewareAPI<SearchState>): Rx.Observable<Action> => {
        return action$
            .ofType(INPUT_CHANGED)
            .debounceTime(SuggestDelay)
            .map(a => suggest(a.payload));
    };

const changeInputOnSuggestionSelectedEpic =
    (action$: ActionsObservable<TypedAction<SearchSuggestion>>,
     store: MiddlewareAPI<SearchState>): Rx.Observable<Action> => {
        return action$
            .ofType(SUGGESTION_SELECTED)
            .map(s => s.payload.title)
            .map(inputChanged);
    };

const searchEpic =
    (action$: ActionsObservable<TypedAction<string>>,
     store: MiddlewareAPI<SearchState>, services: IServices): Rx.Observable<Action> => {
        return action$
            .ofType(SEARCH)
            .map(a => a.payload)
            .distinctUntilChanged()
            .switchMap(input =>
                services.wikipedia.pageContent(input)
                    .map(p => new ContentResult(p))
                    .catch((error: Error) => {
                        console.log("search caught error " + error);
                        return Rx.Observable.of<ISearchResults>(new ErrorResult(error.message));
                    }))
            .map(searchFulfilled);
    };

const suggestEpic =
    (action$: ActionsObservable<TypedAction<string>>,
     store: MiddlewareAPI<SearchState>,
     services: IServices): Rx.Observable<Action> => {
        return action$
            .ofType(SUGGEST)
            .map(a => a.payload)
            .distinctUntilChanged()
            .switchMap(input =>
                services.wikipedia.pages(input)
                    .map(pages => pages.map(p => {
                        let suggestion =  new SearchSuggestion(p.title);
                        if (p.terms != null && p.terms.description.length > 0) {
                            suggestion = suggestion.withDescription(p.terms.description[0]);
                        }
                        if (p.thumbnail != null) {
                            suggestion = suggestion.withThumbnailUrl(p.thumbnail.source);
                        }
                        return suggestion;
                    })).catch((error: Error) => {
                        console.log("suggest caught error " + error);
                        return Rx.Observable.of<SearchSuggestion[]>([]);
                    }))
            .map(suggestFulfilled);
    };

export const searchEpics = combineEpics(searchOnInputChangedEpic, suggestOnInputChangedEpic, searchEpic, suggestEpic);

// Redux selectors: any time the store is updated, mapStateToProps will be called. 
// The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
const mapStateToProps: MapStateToProps<SearchStateProps, any> = (state: AppState, ownProps: any) => {
    return {
        suggestions: state.search.suggestions.map((s, idx) => {
            const suggestion: SearchSuggestionProps = { id: idx, title: s.title, description: s.description, image: s.thumbnailUrl };
            return suggestion;
        }),
        input: state.search.input,
        error: state.search.searchResults.error,
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