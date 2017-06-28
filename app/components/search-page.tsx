import * as React from "react";
import { Search, Segment, Container, Header, Image, Grid, SearchResultProps, Icon } from "semantic-ui-react";

export interface SearchSuggestionProps {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly image: string;
}

export interface SearchPageStateProps {
    readonly input: string;
    readonly error: string;
    readonly loading: boolean;
    readonly suggestionsLoading: boolean;
    readonly menuOpen: boolean;
    readonly suggestions: SearchSuggestionProps[];
    readonly hasContent: boolean;
    readonly content: string;
}

export interface SearchPageDispatchProps {
    inputChanged: (text: string) => void;
    suggestionSelected: (suggestionId: SearchSuggestionProps) => void;
}

export interface SearchPageProps extends SearchPageStateProps, SearchPageDispatchProps {
}

function createMarkup(html: string) {
    return { __html: html };
}


export class SearchInput extends React.Component<SearchPageProps, any> {
    public props: SearchPageProps;

    constructor(props: SearchPageProps) {
        super(props);
        this.props = props;
    }

    public render() {
        return (
            <Grid>
                <Grid.Column width={16}>
                    <Grid.Row centered style={{ marginTop: 20 }}>
                        <Grid.Column>
                            <Image src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" centered size="small" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Container style={{ marginTop: 10 }}>
                            <Search
                                loading={this.props.suggestionsLoading}
                                input={{ fluid: true }}
                                results={this.props.suggestions}
                                onSearchChange={(evt, text) => this.props.inputChanged(text)}
                                onResultSelect={(evt, result) => this.props.suggestionSelected({
                                    id: result.id || 0, title: result.title || "", description: result.description || "", image: result.image || ""
                                })}
                                value={this.props.input}
                                open={this.props.menuOpen}
                                icon="wikipedia"
                                showNoResults
                                fluid
                            />
                        </Container>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment loading={this.props.loading} basic style={{ marginTop: 20 }}>
                            <Container>{this.props.hasContent ? <div dangerouslySetInnerHTML={createMarkup(this.props.content)} /> : ""}</Container>
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}
