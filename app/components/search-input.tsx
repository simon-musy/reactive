import * as React from "react";
import { Search, Header, Image, Grid, SearchResultProps } from "semantic-ui-react";

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
            <Grid columns={1} centered>
                <Grid.Row></Grid.Row>
                <Grid.Row centered>
                    <Grid.Column>
                        <Image src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" centered size="small" />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Grid.Column width={10}>
                        <Search loading={this.props.loading}
                            input={{ fluid: true }}
                            results={this.props.suggestions}
                            onSearchChange={(evt, text) => this.props.inputChanged(text)}
                            onResultSelect={(evt, result) => this.props.suggestionSelected({
                                id: result.id || 0, title: result.title || "", description: result.description || "", image: result.image || ""
                            })}
                            value={this.props.input}
                            open={this.props.menuOpen}
                            showNoResults
                            fluid
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
