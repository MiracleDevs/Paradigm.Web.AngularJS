/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import  * as $ from "jquery";

@Directive({
    name: "selectToggleClass",
    restrict: "A"
})
export class SelectToggleClassDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var className = instanceAttributes["selectToggleClass"];

        function documentClick()
        {
            instanceElement.removeClass(className);
        }

        $("html").on("click.selectToggleClass", documentClick);

        instanceElement.on("click", e =>
        {
            e.stopPropagation();
            instanceElement.toggleClass(className);
        });
    }

    protected dispose(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        $("html").unbind("click.selectToggleClass");
        super.dispose(scope, instanceElement, instanceAttributes, controller, transclude);
    }

    static factory(): SelectToggleClassDirective
    {
        return new SelectToggleClassDirective();
    }
}