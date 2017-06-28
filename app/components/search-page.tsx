import * as React from "react";
import { Search, Segment, Container, Header, Image, Grid, SearchResultProps, Icon, Menu, MenuItem } from "semantic-ui-react";

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
            <div>
                <Menu fixed="top" borderless>
                    <Menu.Item>
                        <Image src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" centered size="tiny" />
                    </Menu.Item>
                    <Menu.Item>
                        <Container>
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
                    </Menu.Item>
                </Menu>
                <Container style={{ marginTop: 100 }}>
                    <Segment loading={this.props.loading} basic style={{ marginTop: 20 }}>
                        <Container>{this.props.hasContent ? <div dangerouslySetInnerHTML={createMarkup(this.props.content)} /> : ""}</Container>
                    </Segment>
                </Container>
            </div>
        );
    }
}
