/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import  * as $ from "jquery";

@Directive({
    name: "toggleClassOnClick",
})
export class ToggleClassOnClickDirective extends DirectiveBase
{
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
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