import { SearchState } from "containers/search/state";
import { Actions, InputChangedActionType, SearchFulfilledActionType, SuggestFulfilledActionType } from "containers/search/actions";

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