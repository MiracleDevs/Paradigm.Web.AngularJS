/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { ITimeoutService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";

@Directive({
    name: "focusWhen",
    restrict: "A",
    dependencies: [AngularServices.timeout]
})
export class FocusWhenDirective extends DirectiveBase
{
    constructor(private timeout: ITimeoutService)
    {
        super();
    }

    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var focusDelay = 100;

        if (instanceAttributes["focus-delay"])
            focusDelay = parseInt(instanceAttributes["focus-delay"]);

        scope.$watch(() => instanceAttributes["focusWhen"], () =>
        {
            this.timeout(() =>
            {
                try
                {
                    const model = scope.$eval(instanceAttributes["focusWhen"]);

                    if (model)
                    {
                        instanceElement.focus();
                    }
                }
                catch (e)
                {

                }
            }, focusDelay);
        });
    }

    static factory(timeout: ITimeoutService): FocusWhenDirective
    {
        return new FocusWhenDirective(timeout);
    }
}