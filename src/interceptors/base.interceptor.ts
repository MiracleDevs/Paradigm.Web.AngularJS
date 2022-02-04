/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IHttpInterceptor, IRequestConfig, IPromise, IQService, IHttpResponse } from "angular";

export class InterceptorBase implements IHttpInterceptor {
    request?(config: IRequestConfig): IRequestConfig | IPromise<IRequestConfig>;

    requestError?(rejection: any): IRequestConfig | IPromise<IRequestConfig>;

    response?<T>(response: IHttpResponse<T>): IPromise<IHttpResponse<T>> | IHttpResponse<T>;

    responseError?<T>(rejection: any): IPromise<IHttpResponse<T>> | IHttpResponse<T>;

    protected q: IQService;

    constructor(q: IQService) {
        this.q = q;

        this.request = c => this.onRequest(c);

        this.response = r => this.onResponse(r);

        this.requestError = r => this.onRequestError(r);

        this.responseError = r => this.onResponseError(r);
    }

    onRequest(config: IRequestConfig): IRequestConfig | IPromise<IRequestConfig> {
        return config;
    }

    onResponse<T>(response: IHttpResponse<T>): IPromise<IHttpResponse<T>> | IHttpResponse<T> {
        return this.q.resolve(response);
    }

    onRequestError(rejection: any): IRequestConfig | IPromise<IRequestConfig> {
        return this.q.reject(rejection);
    }

    onResponseError<T>(rejection: any): IPromise<IHttpResponse<T>> | IHttpResponse<T> {
        return this.q.reject(rejection);
    }
}
