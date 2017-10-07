/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { DirectiveBase } from "./base.directive";
import { ITimeoutService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";

@Directive({
    name: "preventEventIf",
    restrict: "A",
    bindings:
    {
        preventEventIf: "&",
        preventEvent: "@"
    },
    dependencies: [AngularServices.timeout]
})
export class PreventEventIfDirective extends DirectiveBase
{
    constructor(private timeout: ITimeoutService)
    {
        super();
    }

    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        instanceElement.on(scope["preventEvent"], e =>
        {
            if (scope["preventEventIf"]())
            {
                event.preventDefault();
                e.stopPropagation();
            }
        });
    }

    static factory(timeout: ITimeoutService): PreventEventIfDirective
    {
        return new PreventEventIfDirective(timeout);
    }
}