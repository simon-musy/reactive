import * as Rx from "rxjs";
import { Http } from "utils/http-helpers";

export interface Thumbnail {
    source: string;
    width: number;
    height: number;
}

export interface Terms {
    description: string[];
}

export interface Page {
    pageid: number;
    title: string;
    thumbnail?: Thumbnail;
    terms?: Terms;
    extract?: string;
}

interface PageInfoQuery {
    pages: Page[];
}

interface PagesInfoResponse {
    query: PageInfoQuery;
}

interface PagesContent {
    [key: string]: Page;
}

interface PageContentQuery {
    // tslint:disable-next-line:ban-types
    pages: PagesContent;
}

interface PageContentResponse {
    query: PageContentQuery;
}

interface PagesRequest {
    action: string;
    format?: string;
    formatversion?: number;
    generator?: string;
    gpssearch?: string;
    gpslimit?: number;
    prop: string;
    titles?: string;
    piprop?: string;
    pithumbsize?: number;
    pilimit?: number;
    redirects: boolean;
    wbptterms?: string;
    origin: string;
}

export interface IWikipediaService {
    pages(searchTerm: string): Rx.Observable<Page[]>;
    pageContent(searchTerm: string): Rx.Observable<string>;
}

export class WikipediaService implements IWikipediaService {
    private static readonly EmptyResults = "empty results";

    private url: string = "https://en.wikipedia.org/w/api.php";

    public pages(searchTerm: string): Rx.Observable<Page[]> {
        return Http.getJson<PagesRequest, PagesInfoResponse>(this.url,
            {
                action: "query",
                formatversion: 2,
                format: "json",
                generator: "prefixsearch",
                gpssearch: searchTerm,
                gpslimit: 10,
                prop: "pageimages|pageterms",
                piprop: "thumbnail",
                pithumbsize: 50,
                pilimit: 10,
                redirects: true,
                wbptterms: "description",
                origin: "*"
            }).map(r => r.query.pages);
    }

    public pageContent(searchTerm: string): Rx.Observable<string> {
        return Http.getJson<PagesRequest, PageContentResponse>(this.url, {
            action: "query",
            format: "json",
            prop: "extracts",
            titles: searchTerm,
            redirects: true,
            origin: "*"
        }).map(r => {
            const pageIds = Object.keys(r.query.pages);
            if (pageIds.length > 0) {
                const page = r.query.pages[pageIds[0]];
                return page.extract == null ? WikipediaService.EmptyResults : page.extract;
            } else {
                return WikipediaService.EmptyResults;
            }
        });
    }
}