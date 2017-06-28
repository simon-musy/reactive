import { SearchState } from "containers/search/state";
import { Actions, InputChangedActionType, SearchFulfilledActionType, SuggestFulfilledActionType, SuggestionSelectedActionType, SuggestActionType, SearchActionType } from "containers/search/actions";

export const searchReducer = (state: SearchState = SearchState.empty, action: Actions): SearchState => {
    switch (action.type) {
        case InputChangedActionType:
            return state.withInput(action.payload);
        case SuggestActionType:
            return state.withSuggestionsLoading();
        case SearchActionType:
            return state.withLoading();                        
        case SearchFulfilledActionType:
            return state.withSearchResults(action.payload).withoutLoading();
        case SuggestFulfilledActionType:
            return state.withSuggestions(action.payload).withMenuOpen().withoutSuggestionsLoading();
        case SuggestionSelectedActionType:
            return state.withMenuClosed();            
        default: return state;
    }
};