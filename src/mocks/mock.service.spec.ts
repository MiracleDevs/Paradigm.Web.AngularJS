/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ServiceBase } from "../services/base.service";
import { AngularServices } from "../services/angular.service";
import { IPromise, IQService, ITimeoutService } from "angular";
import { Service } from "../decorators/service";
import { LoggingService, LogType } from "../services/logging.service";

export class TestLoggingService extends LoggingService
{
    private logWritten: number[];

    constructor()
    {
        super();
        this.logWritten = [];
        this.logWritten.push(0);
        this.logWritten.push(0);
        this.logWritten.push(0);
        this.logWritten.push(0);
        this.logWritten.push(0);
        this.logWritten.push(0);
    }

    log(message: string, type: LogType = LogType.Trace, tag: string = null): void
    {
        // comment this line to disable test logs.
        // super.log(message, type, tag);
        this.logWritten[type]++;
    }

    getLogWritten(type: LogType): number {
        return this.logWritten[type];
    }
}

export interface ITestPromiseService
{
    numberPromise(): IPromise<number>;

    booleanPromise(): IPromise<boolean>;

    stringPromise(): IPromise<string>;

    datePromise(): IPromise<Date>;

    objectPromise(): IPromise<Object>;

    arrayPromise(): IPromise<number[]>;

    rejectPromise(): IPromise<number>;
}

@Service({
    name: "TestPromiseService",
    factory: TestPromiseService.factory,
    dependencies: [AngularServices.q, AngularServices.timeout]
})
export class TestPromiseService extends ServiceBase implements ITestPromiseService
{
    private readonly q: IQService;

    private readonly timeout: ITimeoutService;

    private readonly delay: number;

    readonly numberResult: number;

    readonly booleanResult: boolean;

    readonly stringResult: string;

    readonly dateResult: Date;

    readonly objectResult: Object;

    readonly arrayResult: Array<any>;

    readonly rejectionReason: string;

    constructor(q: ng.IQService, timeout: ITimeoutService)
    {
        super();
        this.q = q;
        this.timeout = timeout;
        this.delay = 500;

        this.numberResult = 1;
        this.booleanResult = true;
        this.stringResult = "hello world";
        this.dateResult = new Date(12, 12, 12);
        this.objectResult = { name: "custom object" };
        this.arrayResult = [1, 2, 3, 4];
        this.rejectionReason = "Testing promise rejection";
    }

    numberPromise(): ng.IPromise<number>
    {
        return this.q.resolve(this.numberResult);
    }

    booleanPromise(): ng.IPromise<boolean>
    {
        return this.q.resolve(this.booleanResult);
    }

    stringPromise(): ng.IPromise<string>
    {
        return this.q.resolve(this.stringResult);
    }

    datePromise(): ng.IPromise<Date>
    {
        return this.q.resolve(this.dateResult);
    }

    objectPromise(): ng.IPromise<Object>
    {
        return this.q.resolve(this.objectResult);
    }

    arrayPromise(): ng.IPromise<number[]>
    {
        return this.q.resolve(this.arrayResult);
    }

    rejectPromise(): ng.IPromise<number>
    {
        return this.q.reject(this.rejectionReason);
    }

    static factory(q: IQService, timeout: ITimeoutService): ITestPromiseService
    {
        return new TestPromiseService(q, timeout);
    }
}