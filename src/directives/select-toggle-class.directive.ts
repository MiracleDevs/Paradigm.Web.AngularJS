/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import  * as $ from "jquery";

@Directive({
    name: "selectToggleClass"
})
export class SelectToggleClassDirective extends DirectiveBase
{
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var className = instanceAttributes["selectToggleClass"];

        function documentClick(): void
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

    protected onDestroy(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        $("html").unbind("click.selectToggleClass");
        super.onDestroy(scope, instanceElement, instanceAttributes, controller, transclude);
    }

    static factory(): SelectToggleClassDirective
    {
        return new SelectToggleClassDirective();
    }
}