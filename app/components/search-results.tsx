import * as React from "react";
import { Container, Segment } from "semantic-ui-react";

export interface SearchResultsProps {
    readonly loading: boolean;
    readonly hasContent: boolean;
    readonly content: string;
}

export class SearchResults extends React.Component<SearchResultsProps, any> {
    public props: SearchResultsProps;

    constructor(props: SearchResultsProps) {
        super(props);
        this.props = props;
    }

    public render() {
        return <Segment loading={this.props.loading}>
            <Container>{this.props.hasContent ? this.props.content : "empty content"}</Container>
        </Segment>;
    }
}
