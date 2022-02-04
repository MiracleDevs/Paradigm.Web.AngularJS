/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ServiceBase } from "./base.service";
import { ObjectExtensions, DateExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { IHttpPromise } from "angular";

export abstract class HttpServiceBase extends ServiceBase {
    protected constructor(private http: ng.IHttpService, private host: string) {
        super();
    }

    protected get<T>(url: string, parameters?: any): IHttpPromise<T> {
        return this.http.get<T>(this.getUrl(url, parameters), { responseType: "json", headers: this.getHeaders() });
    }

    protected post<T>(url: string, parameters?: any, body?: any): IHttpPromise<T> {
        return this.http.post<T>(this.getUrl(url, parameters), body, { responseType: "json", headers: this.getHeaders() });
    }

    protected put<T>(url: string, parameters?: any, body?: any): IHttpPromise<T> {
        return this.http.put<T>(this.getUrl(url, parameters), body, { responseType: "json", headers: this.getHeaders() });
    }

    protected patch<T>(url: string, parameters?: any, body?: any): IHttpPromise<T> {
        return this.http.patch<T>(this.getUrl(url, parameters), body, { responseType: "json", headers: this.getHeaders() });
    }

    protected delete<T>(url: string, parameters?: any): IHttpPromise<T> {
        return this.http.delete<T>(this.getUrl(url, parameters), { responseType: "json", headers: this.getHeaders() });
    }

    protected options<T>(url: string, parameters?: any): IHttpPromise<T> {
        throw Error("Http verb not supported.");
    }

    private getStringValue(value: any): string {
        if (ObjectExtensions.isNull(value)) return "";

        if (ObjectExtensions.getTypeName(value) === "Number" || ObjectExtensions.getTypeName(value) === "String" || ObjectExtensions.getTypeName(value) === "Boolean") {
            return value.toString();
        }

        if (ObjectExtensions.getTypeName(value) === "Date") {
            return DateExtensions.formatUTC(value, "yyyy-MM-ddThh:mm:ss.fff");
        }

        return "";
    }

    private getUrl(url: string, params?: any): string {
        if (!ObjectExtensions.isNull(params)) {
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    url = url.replace(`{${key}}`, this.getStringValue(params[key]));
                }
            }
        }

        return `${this.host}${url}`;
    }

    protected getHeaders(): any {
        return { "Content-Type": "application/json; charset=utf-8" };
    }
}
