/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IHttpInterceptor, IRequestConfig, IHttpPromiseCallbackArg, IPromise, IQService } from "angular";

export class InterceptorBase implements IHttpInterceptor
{
    request: (config: IRequestConfig) => IRequestConfig;

    response: (response: IHttpPromiseCallbackArg<any>) => IPromise<any>;

    requestError: (rejection: ng.IHttpPromiseCallbackArg<any>) => IPromise<any>;

    responseError: (rejection: ng.IHttpPromiseCallbackArg<any>) => IPromise<any>;

    protected q: IQService;

    constructor(q: IQService)
    {
        this.q = q;

        this.request = c => this.onRequest(c);

        this.response = r => this.onResponse(r);

        this.requestError = r => this.onRequestError(r);

        this.responseError = r => this.onResponseError(r);
    }

    onRequest(config: IRequestConfig): IRequestConfig
    {
        return config;
    }

    onResponse(response: IHttpPromiseCallbackArg<any>): IPromise<any>
    {
        return this.q.resolve(response);
    }

    onRequestError(rejection: IHttpPromiseCallbackArg<any>): IPromise<any>
    {
        return this.q.reject(rejection);
    }

    onResponseError(rejection: IHttpPromiseCallbackArg<any>): IPromise<any>
    {
        return this.q.reject(rejection);
    }
}