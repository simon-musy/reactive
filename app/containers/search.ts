
import { AppState } from "app-state";
import { SearchStateProps, SearchSuggestionProps, SearchInput, SearchDispatchProps } from "components/search-input";
import { connect, MapStateToProps, MapDispatchToProps, Dispatch, ComponentDecorator, DispatchProp, MapDispatchToPropsFunction } from "react-redux";
import { MiddlewareAPI, bindActionCreators } from "redux";
import { combineEpics, ActionsObservable } from "redux-observable";
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
const InputChangedActionType = "INPUT_CHANGED";
const SearchActionType = "SEARCH";
const SearchFulfilledActionType = "SEARCH_FULFILLED";
const SuggestActionType = "SUGGEST";
const SuggestFulfilledActionType = "SUGGEST_FULFILLED";
const SuggestionSelectedActionType = "SUGGESTION_SELECTED";

// Actions
type InputChangedAction = TypedAction<typeof InputChangedActionType, string>;
type SearchAction = TypedAction<typeof SearchActionType, string>;
type SearchFulfilledAction = TypedAction<typeof SearchFulfilledActionType, SearchResult>;
type SuggestAction = TypedAction<typeof SuggestActionType, string>;
type SuggestFulfilledAction = TypedAction<typeof SuggestFulfilledActionType, SearchSuggestion[]>;
type SuggestionSelectedAction = TypedAction<typeof SuggestionSelectedActionType, SearchSuggestion>;

type Actions =
    InputChangedAction
    | SearchAction
    | SearchFulfilledAction
    | SuggestAction
    | SuggestFulfilledAction
    | SuggestionSelectedAction;

// Action creators
const inputChanged = (input: string): InputChangedAction => createAction(InputChangedActionType, input);
const search = (input: string): SearchAction => createAction(SearchActionType, input);
const suggest = (input: string): SuggestAction => createAction(SuggestActionType, input);
const suggestionSelected = (suggestion: SearchSuggestionProps): SuggestionSelectedAction => createAction(SuggestionSelectedActionType, 
    new SearchSuggestion(suggestion.title, suggestion.description, suggestion.image));
const suggestFulfilled = (input: SearchSuggestion[]): SuggestFulfilledAction => createAction(SuggestFulfilledActionType, input);
const searchFulfilled = (response: SearchResult): SearchFulfilledAction => createAction(SearchFulfilledActionType, response);

// Reducer
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
export const searchReducer = (state: SearchState = SearchState.empty, action: Actions): SearchState => {
    switch (action.type) {
        case InputChangedActionType:
            return state.withInput(action.payload);
        case SearchFulfilledActionType:
            return state.withSearchResults(action.payload);
        case SuggestFulfilledActionType:
            return state.withSuggestions(action.payload);
        default: return state;
    }
};

// Epics
const SearchDelay = 300;
const searchOnInputChangedEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>): Observable<Actions> => {
        return action$
            .actionsOfType<InputChangedAction>(InputChangedActionType)
            .map(a => a.payload)
            .debounceTime(SearchDelay)
            .map(inputChanged);
    };

const SuggestDelay = 100;
const suggestOnInputChangedEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>): Observable<Actions> => {
        return action$
            .actionsOfType<InputChangedAction>(InputChangedActionType)
            .debounceTime(SuggestDelay)
            .map(a => a.payload)
            .map(suggest);
    };

const changeInputOnSuggestionSelectedEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>): Observable<Actions> => {
        return action$
            .actionsOfType<SuggestionSelectedAction>(SuggestionSelectedActionType)
            .map(s => s.payload.title)
            .map(inputChanged);
    };

const searchEpic =
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>, services: IServices): Observable<Actions> => {
        return action$
            .actionsOfType<SearchAction>(SearchActionType)
            .map(a => a.payload)
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
    (action$: ActionsObservable<Actions>,
     store: MiddlewareAPI<SearchState>,
     services: IServices): Observable<Actions> => {
        return action$
            .actionsOfType<SuggestAction>(SuggestActionType)
            .map(a => a.payload)
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

export const searchEpics = combineEpics(searchOnInputChangedEpic, suggestOnInputChangedEpic, searchEpic, suggestEpic, changeInputOnSuggestionSelectedEpic);

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