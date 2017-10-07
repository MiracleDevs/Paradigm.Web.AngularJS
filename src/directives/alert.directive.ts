/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { DirectiveBase } from "./base.directive";
import { ITimeoutService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "alert",
    bindings: {
        alertType: "@",
        timeout: "@",
        close: "&"
    },
    dependencies: [AngularServices.timeout]
})
export class AlertDirective extends DirectiveBase
{
    constructor(private timeout: ITimeoutService)
    {
        super();
    }

    protected create(scope: IAlertScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        const alertType = scope.alertType;
        const timeout = parseInt(scope.timeout);

        instanceElement.addClass("alert");

        if (!ObjectExtensions.isNull(alertType))
            instanceElement.addClass(alertType);

        if (!ObjectExtensions.isNull(timeout))
            this.timeout(() => scope.close(), timeout);
    }

    static factory(timeout: ITimeoutService): AlertDirective
    {
        return new AlertDirective(timeout);
    }
}

export interface IAlertScope extends IScope
{
    alertType: string;

    timeout: string;

    close: Function;
}