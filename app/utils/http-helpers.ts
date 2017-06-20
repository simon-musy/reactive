import "rxjs/add/observable/dom/ajax";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";

export class Http {
    public static getJson<TParams, TResp>(url: string, params?: TParams): Observable<TResp> {
        return Observable.ajax.getJSON<TResp>(Http.composeUrl(url, params));
    }

    public static postJson<TParams, TData, TResp>(url: string, data: TData, params?: TParams): Observable<TResp> {
        return Observable.ajax.post(Http.composeUrl(url, params), JSON.stringify(data),
            {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
            })
            .map(r => r.response as TResp);
    }

    private static composeUrl(url: string, params?: any) {
        return params ? `${url}?${Http.encodeParams(params)}` : url;
    }

    private static encodeParams(params: any) {
        return Object.keys(params).map(key => [key, params[key]].map(encodeURIComponent).join("=")).join("&");
    }
}
