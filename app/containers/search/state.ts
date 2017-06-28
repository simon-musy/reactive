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
    public static empty: SearchState = new SearchState("", [], EmptyResult.Instance, false, false, false);

    public constructor(public readonly input: string,
                       public readonly suggestions: SearchSuggestion[],
                       public readonly searchResult: SearchResult,
                       public readonly suggestionsLoading: boolean,
                       public readonly loading: boolean,
                       public readonly menuOpen: boolean) {
    }

    public withInput(input: string): SearchState {
        return new SearchState(input, this.suggestions, this.searchResult, this.suggestionsLoading, this.loading, this.menuOpen);
    }

    public withSuggestions(suggestions: SearchSuggestion[]): SearchState {
        return new SearchState(this.input, suggestions, this.searchResult, this.suggestionsLoading, this.loading, this.menuOpen);
    }

    public withSearchResults(result: SearchResult): SearchState {
        return new SearchState(this.input, this.suggestions, result, this.suggestionsLoading, this.loading, this.menuOpen);
    }

    public withMenuClosed(): SearchState {
        return new SearchState(this.input, this.suggestions, this.searchResult, this.suggestionsLoading, this.loading, false);
    }

    public withMenuOpen(): SearchState {
        return new SearchState(this.input, this.suggestions, this.searchResult, this.suggestionsLoading, this.loading, true);
    }

    public withSuggestionsLoading(): SearchState {
        return new SearchState(this.input, this.suggestions, this.searchResult, true, this.loading, this.menuOpen);
    }

    public withLoading(): SearchState {
        return new SearchState(this.input, this.suggestions, this.searchResult, this.suggestionsLoading, true, this.menuOpen)
    }

    public withoutSuggestionsLoading(): SearchState {
        return new SearchState(this.input, this.suggestions, this.searchResult, false, this.loading, this.menuOpen);
    }

    public withoutLoading(): SearchState {
        return new SearchState(this.input, this.suggestions, this.searchResult, this.suggestionsLoading, false, this.menuOpen)
    }

}