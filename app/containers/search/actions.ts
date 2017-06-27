import {createAction} from "utils/redux-observable-helpers";
import {SearchSuggestion, SearchResult} from "containers/search/state";
import {TypedAction} from "utils/redux-observable-helpers";
import { SearchSuggestionProps } from "components/search-input";

// Action names
export const InputChangedActionType = "INPUT_CHANGED";
export const SearchActionType = "SEARCH";
export const SearchFulfilledActionType = "SEARCH_FULFILLED";
export const SuggestActionType = "SUGGEST";
export const SuggestFulfilledActionType = "SUGGEST_FULFILLED";
export const SuggestionSelectedActionType = "SUGGESTION_SELECTED";

// Actions
export type InputChangedAction = TypedAction<typeof InputChangedActionType, string>;
export type SearchAction = TypedAction<typeof SearchActionType, string>;
export type SearchFulfilledAction = TypedAction<typeof SearchFulfilledActionType, SearchResult>;
export type SuggestAction = TypedAction<typeof SuggestActionType, string>;
export type SuggestFulfilledAction = TypedAction<typeof SuggestFulfilledActionType, SearchSuggestion[]>;
export type SuggestionSelectedAction = TypedAction<typeof SuggestionSelectedActionType, SearchSuggestion>;

export type Actions =
    InputChangedAction
    | SearchAction
    | SearchFulfilledAction
    | SuggestAction
    | SuggestFulfilledAction
    | SuggestionSelectedAction;

// Action creators
export const inputChanged = (input: string): InputChangedAction => createAction(InputChangedActionType, input);
export const search = (input: string): SearchAction => createAction(SearchActionType, input);
export const suggest = (input: string): SuggestAction => createAction(SuggestActionType, input);
export const suggestionSelected = (suggestion: SearchSuggestionProps): SuggestionSelectedAction => createAction(SuggestionSelectedActionType, 
    new SearchSuggestion(suggestion.title, suggestion.description, suggestion.image));
export const suggestFulfilled = (input: SearchSuggestion[]): SuggestFulfilledAction => createAction(SuggestFulfilledActionType, input);
export const searchFulfilled = (response: SearchResult): SearchFulfilledAction => createAction(SearchFulfilledActionType, response);
