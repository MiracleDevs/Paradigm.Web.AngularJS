/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "formatAsNumber",
    require: "?ngModel",
})
export class FormatAsNumberDirective extends DirectiveBase {
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        if (!ObjectExtensions.isNull(controller)) {
            controller.$formatters.unshift(value => {
                return ObjectExtensions.isNull(value) || value === "" ? null : Number(value).toFixed(instanceAttributes["decimalPlaces"] || 2);
            });

            controller.$parsers.unshift(value => {
                return ObjectExtensions.isNull(value) || value === "" ? null : Number(value).valueOf();
            });

            instanceElement.blur(() => {
                var value = instanceElement.val();
                return instanceElement.val(ObjectExtensions.isNull(value) || value === "" ? null : Number(instanceElement.val()).toFixed(instanceAttributes["decimalPlaces"] || 2));
            });
        }
    }

    static factory(): FormatAsNumberDirective {
        return new FormatAsNumberDirective();
    }
}
