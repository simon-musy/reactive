import { Observable } from "rxjs/Rx";
import {Http} from "utils/http-helpers";

export interface Thumbnail {
    source: string;
    width: number;
    height: number;
}

export interface Terms {
    description: string;
}

export interface Page {
    id: number;
    title: string;
    thumbnail: Thumbnail;
    terms: Terms[];
    extract: string;
}

interface PagesResponse {
    query: Page[];
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
    piphtumbsize?: number;
    pilimit?: number;
    redirects: boolean;
    wbptterms?: string;
}

export interface IWikipediaService {
    pages(searchTerm: string): Observable<Page[]>;
    pageContent(searchTerm: string): Observable<string>;
}

export default class WikipediaService implements IWikipediaService {
    private url: string = "https://en.wikipedia.org/w/api.php";

    public pages(searchTerm: string): Observable<Page[]> {
        return Http.getJson<PagesRequest, PagesResponse>(this.url, 
        {
            action: "query",
            formatversion: 2,
            generator: "prefixsearch",
            gpssearch: searchTerm,
            gpslimit: 10,
            prop: "pageimages|pageterms",
            piprop: "thumbnail",
            piphtumbsize: 50,
            pilimit: 10,
            redirects: true,
            wbptterms: "description"
         }).map(r => r.query);
    }

    public pageContent(searchTerm: string): Observable<string> {
        return Http.getJson<PagesRequest, PagesResponse>(this.url, {
            action: "query",
            format: "xml",
            prop: "extracts",
            titles: searchTerm,
            redirects: true
        }).map(r => r.query[0].extract);
    }
}