import { searchReducer } from "./reducer";
import { SearchState, ContentResult, EmptyResult, ErrorResult } from "./state";
import { inputChanged } from "./actions";

describe("app/containers/search/reducer", () => {
    test("reducer for input changed", () => {
        const someInput = "asdf";
        const state = searchReducer(SearchState.empty, inputChanged(someInput));
        expect(state.input).toBe(someInput);
    });
});