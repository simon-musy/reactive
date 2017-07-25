import { searchReducer } from "./reducer";
import { SearchResult, SearchSuggestion, SearchState, ContentResult, EmptyResult, ErrorResult } from './state';
import {hideMenu, showMenu,  searchFulfilled,   SearchSuggestions,   suggestFulfilled,   suggest,   inputSet,   inputChanged} from './actions';
import * as jsc from "jsverify";
import * as _ from "lodash";

describe("app/containers/search/reducer", () => {
    // define the various arbitraries for our state, this will allow testing with randomized search states and pinpointing
    // the problematic cases via shrinking
    const searchSuggestionArb = jsc.array(jsc.string).smap(ss => new SearchSuggestion(ss[0], ss[1], ss[2]), sugg => [sugg.title, sugg.description, sugg.description]);
    const searchSuggestionsArb = jsc.array(searchSuggestionArb);
    const searchResultArb: jsc.Arbitrary<SearchResult> = (jsc as any).oneof(    // jsc typings are incorrect, see https://github.com/jsverify/jsverify/issues/233
        [jsc.string.smap(s => new ContentResult(s), r => r.content),
        jsc.constant(EmptyResult.Instance),
        jsc.string.smap(s => new ErrorResult(s), e => e.error)]);
    const searchStatesGen =
        searchResultArb.generator.flatmap(res =>
            searchSuggestionsArb.generator.flatmap(suggs =>
                jsc.array(jsc.string).generator.
                    flatmap(ss => jsc.array(jsc.bool).generator.
                        flatmap(bb => jsc.array(jsc.number).generator.map(nn =>
                            new SearchState(ss[0], suggs, res, bb[0], bb[1], bb[2]))))));
    const searchStatesArb: jsc.Arbitrary<SearchState> = jsc.bless({
        generator: searchStatesGen,
        shrink: jsc.shrink.noop,
        show: (s: SearchState) => JSON.stringify(s)
    });

    test("jsverify sanity test", () => {
        jsc.assertForall(jsc.constant(1), (num) => {
            return num === 1;
        });
    });

    test("reducer for input changed", () => {
        jsc.assertForall(jsc.string, searchStatesArb, (someInput: string, someState) => {
            const state = searchReducer(someState, inputChanged(someInput));
            return state.input === someInput;
        });
    });

    test("reducer for input set", () => {
        jsc.assertForall(jsc.string, searchStatesArb, (someInput, someState) => {
            const state = searchReducer(someState, inputSet(someInput));
            return state.input === someInput;
        });
    });

    test("reducer for suggest", () => {
        jsc.assertForall(jsc.string, jsc.bool, searchStatesArb, (input, isValid, someState) => {
            const state = searchReducer(someState, suggest(input, isValid));
            return state.suggestionsLoading === true;
        });
    });

    test("reducer for suggest fullfilled", () => {
        jsc.assertForall(jsc.bool, searchSuggestionsArb, searchStatesArb, (containsAlternatives, suggestions, someState) => {
            const state = searchReducer(someState, suggestFulfilled({ containsAlternatives, suggestions }));
            return state.suggestionsLoading === false && containsAlternatives ? true : state.menuOpen;
        }
        );
    });

    test("reducer for search fullfilled", () => {
        jsc.assertForall(searchResultArb, searchStatesArb, (result, someState) => {
            const state = searchReducer(someState, searchFulfilled(result));
            return state.loading === false && state.searchResult === result;
        }
        );
    });

    test("reducer for show menu", () => {
        jsc.assertForall(searchStatesArb, (someState) => {
            const state = searchReducer(someState, showMenu());
            return state.menuOpen === _.isEmpty(someState.suggestions) ? state.menuOpen : true;
        });
    });

    test("reducer for hide menu", () => {
        jsc.assertForall(searchStatesArb, (someState) => {
            const state = searchReducer(someState, hideMenu());
            return state.menuOpen === false;
        });
    });
});