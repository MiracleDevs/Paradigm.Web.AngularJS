/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IScope, auto, IPromise, IOnChangesObject, translate } from "angular";
import { StateService, StateObject } from "@uirouter/angularjs";
import { ObjectExtensions, FunctionExtensions, ArrayList } from "@miracledevs/paradigm-ui-web-shared";
import { IController } from "../decorators/controller";
import { MessageBus, RegistrationToken } from "../services/message-bus.service";
import { AlertService } from "../services/alert.service";
import { LoggingService } from "../services/logging.service";
import { ModalInstance } from "../services/modal.service";
import { ModalService } from "../services/modal.service";
import { AngularServices } from "../services/angular.service";
import { AngularControllerBase } from "./angular-base.controller";
import { InjectorService } from "../services/injector.service";

export abstract class ControllerBase extends AngularControllerBase
{
    protected alertService: AlertService;

    protected stateService: StateService;

    protected messageBus: MessageBus;

    protected translator: translate.ITranslateService;

    protected logger: LoggingService;

    protected messageBusTokens: ArrayList<RegistrationToken>;

    protected constructor(scope: IScope, protected injector: InjectorService)
    {
        super(scope);
        this.initializeServices();
    }

    protected initializeServices(): void
    {
        this.logger = this.getService(LoggingService);
        this.alertService = this.getService(AlertService);
        this.stateService = this.getService<StateService>(AngularServices.state);
        this.messageBus = this.getService(MessageBus);
        this.translator = this.getService<translate.ITranslateService>(AngularServices.translate);
        this.messageBusTokens = new ArrayList();
    }

    protected onDestroy(): void
    {
        super.onDestroy();
        this.unregisterAllMessages();
    }

    protected getService<T>(service: string): T;
    protected getService<T>(service: { new(...args: any[]): T }): T;
    protected getService<T>(service: any): T
    {
        return this.injector.get(service);
    }

    protected open(controller: Function | IController, parameters?: any, staticDialog?: boolean, keyboard?: boolean): ModalInstance
    {
        return this.getService(ModalService).open(controller, parameters, staticDialog, keyboard);
    }

    protected translate(key: string): string
    {
        return this.translator.instant(key);
    }

    protected call<T>(
        call: () => IPromise<T>,
        success?: (result: T) => void,
        loading?: (loading: boolean) => void,
        fail?: (reason: any) => void): void
    {
        if (!ObjectExtensions.isNull(loading))
            loading(true);

        call()
            .then(result =>
            {
                if (!ObjectExtensions.isNull(loading))
                    loading(false);

                if (!ObjectExtensions.isNull(success))
                    success(result);
            })
            .catch(error =>
            {
                if (!ObjectExtensions.isNull(loading))
                    loading(false);

                if (!ObjectExtensions.isNull(fail))
                    fail(error);

                this.handleException(error);
            });
    }

    protected showErrors(messages: string[]): void
    {
        if (messages.length === 0)
            return;

        for (let i = 0; i < messages.length; i++)
        {
            this.showError(messages[i]);
        }
    }

    protected showWarnings(messages: string[]): void
    {
        if (messages.length === 0)
            return;

        for (let i = 0; i < messages.length; i++)
        {
            this.showWarning(messages[i]);
        }
    }

    protected showError(message: string): void
    {
        this.alertService.addError(message);
    }

    protected showWarning(message: string): void
    {
        this.alertService.addWarning(message);
    }

    protected showMessage(message: string): void
    {
        this.alertService.addMessage(message);
    }

    protected handleException(ex: any): void
    {
        if (ObjectExtensions.isNull(ex))
            return;

        // if ex.data is not null, it's probably a
        // an http promise exception.
        if (!ObjectExtensions.isNull(ex.data))
            ex = ex.data;

        if (!ObjectExtensions.isNull(ex.message))
        {
            this.showError(ex.message);
        }
        else if (!ObjectExtensions.isNull(ex.Message))
        {
            this.showError(ex.Message);
        }
        else if (!ObjectExtensions.isNull(ex.ExceptionMessage))
        {
            this.showError(ex.ExceptionMessage);
        }
        else if (!ObjectExtensions.isNull(ex.error) && !ObjectExtensions.isNull(ex.error.message))
        {
            this.showError(ex.error.message);
        }
    }

    protected changeState(state: string, params?: any, reload: boolean = false): Promise<StateObject>
    {
        return this.stateService.go(state, params, { reload: reload });
    }

    protected registerMessage<T>(messageType: { new(...args: any[]): T }, handler: (x: T) => void): RegistrationToken
    {
        var token = this.messageBus.register(messageType, handler);
        this.messageBusTokens.add(token);
        return token;
    }

    protected sendMessage<T>(message: T, token?: RegistrationToken): boolean
    {
        return this.messageBus.send(message);
    }

    protected unregisterMessage(token: RegistrationToken): void
    {
        if (!this.messageBusTokens.any(x => x.guid === token.guid))
            throw new Error("Can not unregister a token registered outside this controller.");

        this.messageBus.unregister(token);
        this.messageBusTokens.removeAll(x => x.guid === token.guid);
    }

    protected unregisterAllMessages(): void
    {
        this.messageBusTokens.forEach(x => this.messageBus.unregister(x));
    }

}
