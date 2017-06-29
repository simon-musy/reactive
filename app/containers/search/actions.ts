import {createAction} from "utils/redux-observable-helpers";
import {SearchSuggestion, SearchResult} from "containers/search/state";
import {TypedAction} from "utils/redux-observable-helpers";
import { SearchSuggestionProps } from "components/search-page";

// Action names
export const InputChangedActionType = "INPUT_CHANGED";
export const InputSetActionType = "INPUT_SET";
export const SearchActionType = "SEARCH";
export const SearchFulfilledActionType = "SEARCH_FULFILLED";
export const SuggestActionType = "SUGGEST";
export const SuggestFulfilledActionType = "SUGGEST_FULFILLED";
export const SuggestionSelectedActionType = "SUGGESTION_SELECTED";
export const HideMenuActionType = "HIDE";
export const ShowMenuActionType = "SHOW";
export const BlurMenuActionType = "BLUR";

// Action parameters
export interface SuggestRequest {
    input: string;
    isValidTerm: boolean; 
}

export interface SearchSuggestions {
    suggestions: SearchSuggestion[];
    containsAlternatives: boolean;
}

// Actions
export type InputChangedAction = TypedAction<typeof InputChangedActionType, string>;
export type InputSetAction = TypedAction<typeof InputSetActionType, string>;
export type SearchAction = TypedAction<typeof SearchActionType, string>;
export type SearchFulfilledAction = TypedAction<typeof SearchFulfilledActionType, SearchResult>;
export type SuggestAction = TypedAction<typeof SuggestActionType, SuggestRequest>;
export type SuggestFulfilledAction = TypedAction<typeof SuggestFulfilledActionType, SearchSuggestions>;
export type SuggestionSelectedAction = TypedAction<typeof SuggestionSelectedActionType, SearchSuggestion>;
export type HideMenuAction = TypedAction<typeof HideMenuActionType, any>;
export type ShowMenuAction = TypedAction<typeof ShowMenuActionType, any>;
export type BlurMenuAction = TypedAction<typeof BlurMenuActionType, any>;

export type Actions =
    InputChangedAction
    | InputSetAction
    | SearchAction
    | SearchFulfilledAction
    | SuggestAction
    | SuggestFulfilledAction
    | SuggestionSelectedAction
    | HideMenuAction
    | BlurMenuAction
    | ShowMenuAction;

// Action creators
export const inputChanged = (input: string): InputChangedAction => createAction(InputChangedActionType, input);
export const inputSet = (input: string): InputSetAction => createAction(InputSetActionType, input);
export const search = (input: string): SearchAction => createAction(SearchActionType, input);
export const suggest = (input: string, isValidTerm: boolean): SuggestAction => createAction(SuggestActionType, {input, isValidTerm});
export const suggestionSelected = (suggestion: SearchSuggestionProps): SuggestionSelectedAction => createAction(SuggestionSelectedActionType, 
    new SearchSuggestion(suggestion.title, suggestion.description, suggestion.image));
export const suggestFulfilled = (input: SearchSuggestions): SuggestFulfilledAction => createAction(SuggestFulfilledActionType, input);
export const searchFulfilled = (response: SearchResult): SearchFulfilledAction => createAction(SearchFulfilledActionType, response);
export const showMenu = (): ShowMenuAction => createAction(ShowMenuActionType, {});
export const hideMenu = (): HideMenuAction => createAction(HideMenuActionType, {});
export const blurMenu = (): BlurMenuAction => createAction(BlurMenuActionType, {});