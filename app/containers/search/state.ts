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