// Redux selectors: any time the store is updated, mapStateToProps will be called. 
// The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
import { MapStateToProps, MapDispatchToPropsFunction } from "@types/react-redux";
import { SearchStateProps, SearchSuggestionProps, SearchDispatchProps } from "components/search-input";
import { AppState } from "app-state";
import { ErrorResult } from "containers/search/state";
import { Dispatch, bindActionCreators } from "redux";
import { inputChanged, suggestionSelected } from "containers/search/actions";

export const mapStateToProps: MapStateToProps<SearchStateProps, any> = (state: AppState, ownProps: any) => {
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

export const mapDispatchToProps: MapDispatchToPropsFunction<SearchDispatchProps, any> = (dispatch: Dispatch<any>, ownProps: any) => {
    return bindActionCreators({ inputChanged, suggestionSelected }, dispatch);
};
