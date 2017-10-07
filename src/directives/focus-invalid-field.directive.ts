/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { IScope, IAugmentedJQuery, IAttributes, ITranscludeFunction, IController } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "focusInvalidField"
})
export class FocusInvalidField extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        instanceElement.on("submit", () =>
        {
            var invalid = instanceElement.find(".ng-invalid");

            if (!ObjectExtensions.isNull(invalid) && invalid.length > 0)
            {
                invalid[0].focus();
            }
        });
    }

    static factory(): FocusInvalidField
    {
        return new FocusInvalidField();
    }
}