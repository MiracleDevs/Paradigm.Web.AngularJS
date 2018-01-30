/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import  * as $ from "jquery";

@Directive({
    name: "convertToNumber",
    require: "ngModel"
})
export class ConvertToNumberDirective extends DirectiveBase
{
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        controller.$parsers.push((val) => ObjectExtensions.isNull(val) ? parseInt(val, 10) : null);
        controller.$formatters.push((val) => val != null ? `${val}` : null);
        var element = $(instanceElement);
    }

    static factory(): ConvertToNumberDirective
    {
        return new ConvertToNumberDirective();
    }
}