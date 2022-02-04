/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { DirectiveBase } from "./base.directive";
import { ITimeoutService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";

@Directive({
    name: "preventEventIf",
    bindings: {
        preventEventIf: "&",
        preventEvent: "@",
    },
    dependencies: [AngularServices.timeout],
})
export class PreventEventIfDirective extends DirectiveBase {
    constructor(private timeout: ITimeoutService) {
        super();
    }

    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        instanceElement.on(scope["preventEvent"], e => {
            if (scope["preventEventIf"]()) {
                event.preventDefault();
                e.stopPropagation();
            }
        });
    }

    static factory(timeout: ITimeoutService): PreventEventIfDirective {
        return new PreventEventIfDirective(timeout);
    }
}
