import * as React from "react";
import * as _ from "lodash";
import { Search, Segment, Container, Header, Image, Grid, SearchProps, SearchResultProps, Icon, Menu, MenuItem, Message } from "semantic-ui-react";

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
    onBlur: () => void;
    onFocus: () => void;
}

export interface SearchPageProps extends SearchPageStateProps, SearchPageDispatchProps {
}

function createMarkup(html: string) {
    return { __html: html };
}


export class SearchPage extends React.Component<SearchPageProps, any> {
    public props: SearchPageProps;

    constructor(props: SearchPageProps) {
        super(props);
        this.props = props;
    }

    public componentWillMount() {
        // prevent unwanted scroll due to top-margin for menu overlap
        document.body.style.height = "80%";
    }

    public componentWillUnmount() {
        document.body.style.height = null;
    }

    public render() {
        const content = this.props.hasContent ?
            this.renderHtmlContent() : _.isEmpty(this.props.error) ? "" : this.renderErrorMessage();
        return (
            <div>
                <Menu fixed="top" borderless>
                    <Menu.Item>
                        <Image src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" centered size="tiny" />
                    </Menu.Item>
                    <Menu.Item fitted>
                        <Container>
                            <Search
                                loading={this.props.suggestionsLoading}
                                input={{ fluid: true }}
                                results={this.props.suggestions}
                                onSearchChange={(evt, props) => this.props.inputChanged(props.value || "")}
                                onBlur={(evt) => this.props.onBlur()}
                                onFocus={(evt) => this.props.onFocus()}
                                onResultSelect={(evt, data) => (this.props.suggestionSelected({
                                    id: data.result.id || 0,
                                    title: data.result.title || "",
                                    description: data.result.description || "",
                                    image: data.result.image || ""
                                }))}
                                value={this.props.input}
                                open={this.props.menuOpen}
                                icon="wikipedia"
                                showNoResults
                                fluid
                                style={{ minWidth: 200 }}
                            />
                        </Container>
                    </Menu.Item>
                </Menu>
                <Container style={{ marginTop: 100 }}>
                    <Segment basic>
                        <Container style={this.props.loading ? { opacity: 0.3 } : { opacity: 1 }} >
                            {content}
                        </Container>
                    </Segment>
                </Container>
            </div>
        );
    }

    private renderHtmlContent() {
        return <div dangerouslySetInnerHTML={createMarkup(this.props.content)} />;
    }

    private renderErrorMessage() {
        return <Message error>
            <Message.Header>An error has occured</Message.Header>
            <p>{this.props.error}</p>
        </Message>;
    }
}
