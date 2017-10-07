/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import  * as $ from "jquery";

@Directive({
    name: "toggleClassOnClick",
    restrict: "A"
})
export class ToggleClassOnClickDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var toggleElement = $(instanceAttributes["toggleElement"] || instanceElement);
        var toggleClass = instanceAttributes["toggleClass"];

        instanceElement.on("click touch", () => $(toggleElement).toggleClass(toggleClass));
    }

    static factory(): ToggleClassOnClickDirective
    {
        return new ToggleClassOnClickDirective();
    }
}