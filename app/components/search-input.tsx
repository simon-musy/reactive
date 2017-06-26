import * as React from "react";
import { Search, SearchResultProps } from "semantic-ui-react";

export interface SearchSuggestionProps {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly image: string;
}

export interface SearchStateProps {
    readonly input: string;
    readonly error: string;
    readonly loading: boolean;
    readonly menuOpen: boolean;
    readonly suggestions: SearchSuggestionProps[];
}

export interface SearchDispatchProps {
    inputChanged: (text: string) => void;
    suggestionSelected: (suggestionId: SearchSuggestionProps) => void;
}

export interface SearchProps extends SearchStateProps, SearchDispatchProps {
}

export class SearchInput extends React.Component<SearchProps, any> {
    public props: SearchProps;

    constructor(props: SearchProps) {
        super(props);
        this.props = props;
    }

    public render() {
        return (
            <Search loading={this.props.loading}
                results={this.props.suggestions}
                onSearchChange={(evt, text) => this.props.inputChanged(text)}
                onResultSelect={(evt, result) => this.props.suggestionSelected({
                    id: result.id || 0, title: result.title || "", description: result.description || "", image: result.image || ""
                })}
                value={this.props.input}
                open={this.props.menuOpen}
                showNoResults={true}
                fluid={true}
            />
        );
    }
}
