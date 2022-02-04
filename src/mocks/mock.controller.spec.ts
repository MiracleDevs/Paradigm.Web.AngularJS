/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ControllerBase } from "../controllers/base.controller";
import { ITestPromiseService } from "./mock.service.spec";
import { IScope, translate } from "angular";
import { InjectorService } from "../services/injector.service";
import { LoggingService } from "../services/logging.service";
import { MessageBus } from "../services/message-bus.service";
import { AlertService } from "../services/alert.service";
import { StateService } from "@uirouter/angularjs";
import { ArrayList } from "@miracledevs/paradigm-ui-web-shared";
import { RegistrationToken } from "../services/message-bus.service";

export class MockController extends ControllerBase {
    readonly service: ITestPromiseService;

    numberResult: number;

    booleanResult: boolean;

    stringResult: string;

    dateResult: Date;

    objectResult: Object;

    arrayResult: Array<any>;

    rejectionReason: string;

    loading: boolean;

    errorShown: number;

    warningShown: number;

    messagesShown: number;

    constructor(scope: IScope, injector: InjectorService, testService: ITestPromiseService) {
        super(scope, injector);

        this.service = testService;

        this.numberResult = 0;
        this.booleanResult = false;
        this.stringResult = "";
        this.dateResult = null;
        this.objectResult = null;
        this.arrayResult = null;
        this.rejectionReason = "";
        this.loading = false;
    }

    getAlertService(): AlertService {
        return this.alertService;
    }
    getStateService(): StateService {
        return this.stateService;
    }
    getMessageBus(): MessageBus {
        return this.messageBus;
    }
    getMessageBusTokens(): ArrayList<RegistrationToken> {
        return this.messageBusTokens;
    }
    getTranslator(): translate.ITranslateService {
        return this.translator;
    }
    getLogger(): LoggingService {
        return this.logger;
    }

    retrieveService<T>(name: string): T {
        return this.getService<T>(name);
    }

    testNumbers(): void {
        this.call(
            () => this.service.numberPromise(),
            x => (this.numberResult = x)
        );
    }

    testBooleans(): void {
        this.call(
            () => this.service.booleanPromise(),
            x => (this.booleanResult = x)
        );
    }

    testStrings(): void {
        this.call(
            () => this.service.stringPromise(),
            x => (this.stringResult = x)
        );
    }

    testDates(): void {
        this.call(
            () => this.service.datePromise(),
            x => (this.dateResult = x)
        );
    }

    testObjects(): void {
        this.call(
            () => this.service.objectPromise(),
            x => (this.objectResult = x)
        );
    }

    testArrays(): void {
        this.call(
            () => this.service.arrayPromise(),
            x => (this.arrayResult = x)
        );
    }

    testRejection(): void {
        this.numberResult = 0;
        this.call(
            () => this.service.rejectPromise(),
            x => (this.numberResult = x),
            null,
            x => (this.rejectionReason = x)
        );
    }

    testLoading(): void {
        this.call(
            () => this.service.numberPromise(),
            x => (this.numberResult = x),
            x => this.isLoading(x)
        );
    }

    private isLoading(loading: boolean): void {
        this.loading = loading;
    }
}
