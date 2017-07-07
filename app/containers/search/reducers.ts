import * as _ from "lodash";
import { SearchState } from "containers/search/state";
import { Actions, InputSetActionType, InputChangedActionType, SearchFulfilledActionType, SuggestFulfilledActionType, SuggestionSelectedActionType, SuggestActionType, SearchActionType, ShowMenuActionType, HideMenuActionType } from "containers/search/actions";

export const searchReducer = (state: SearchState = SearchState.empty, action: Actions): SearchState => {
    switch (action.type) {
        case InputChangedActionType:
            return state.withInput(action.payload);
        case InputSetActionType:
            return state.withInput(action.payload);            
        case SuggestActionType:
            return state.withSuggestionsLoading();
        case SearchActionType:
            return state.withLoading();
        case SearchFulfilledActionType:
            return state.withSearchResults(action.payload).withoutLoading();
        case SuggestFulfilledActionType:
            const newState = state.withSuggestions(action.payload.suggestions).withoutSuggestionsLoading();
            return (action.payload.containsAlternatives) ? newState : newState.withMenuOpen(); 
        case ShowMenuActionType:
            return _.isEmpty(state.suggestions) ? state : state.withMenuOpen();
        case HideMenuActionType:
            return state.withMenuClosed();
        default: return state;
    }
};