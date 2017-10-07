/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import * as $ from "jquery";

@Directive({
    name: "toggleClass",
    restrict: "A"
})
export class ToggleClassDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        const options = <IToggleClassParameters>{};

        this.tryGet(options, instanceAttributes, "element");
        this.tryGet(options, instanceAttributes, "toggleClass");

        const element = $(options.element) || instanceElement;

        if (!element.hasClass(options.toggleClass))
            element.addClass(options.toggleClass);
        else
            element.removeClass(options.toggleClass);
    }

    static factory(): ToggleClassDirective
    {
        return new ToggleClassDirective();
    }
}

export interface IToggleClassParameters
{
    toggleClass: string;

    element: string;
}