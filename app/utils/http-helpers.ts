import "rxjs/add/observable/dom/ajax";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { AjaxRequest } from "rxjs/Rx";

export class Http {
    public static getJson<TParams, TResp>(url: string, params?: TParams): Observable<TResp> {
        const req = Http.createAjaxRequest<TParams>(url, params);
        req.method = "GET";
        return Observable.ajax(req).map(r => r.response as TResp);
    }

    public static postJson<TParams, TData, TResp>(url: string, data: TData, params?: TParams): Observable<TResp> {
        const req = Http.createAjaxRequest<TParams>(url, params);
        req.body = JSON.stringify(data);
        req.method = "POST";
        return Observable.ajax(req).map(r => r.response as TResp);
    }

    private static createAjaxRequest<TParams>(url: string, params?: TParams): AjaxRequest {
        return {
            url: Http.composeUrl(url, params),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
                "Api-User-Agent": "Example/1.0"
            },
            crossDomain: true,
            responseType: "json"
        };
    }

    private static composeUrl(url: string, params?: any) {
        return params ? `${url}?${Http.encodeParams(params)}` : url;
    }

    private static encodeParams(params: any) {
        return Object.keys(params).map(key => [key, params[key]].map(encodeURIComponent).join("=")).join("&");
    }
}
