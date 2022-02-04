/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import * as $ from "jquery";

@Directive({
    name: "addClass",
})
export class AddClassDirective extends DirectiveBase {
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        const options = {} as IAddClassParameters;

        this.tryGet(options, instanceAttributes, "element");
        this.tryGet(options, instanceAttributes, "addClass");

        if (!ObjectExtensions.isNull(options.element)) {
            const element = $(options.element);

            if (!element.hasClass(options.addClass)) {
                element.addClass(options.addClass);
            }
        }
    }

    static factory(): AddClassDirective {
        return new AddClassDirective();
    }
}

export interface IAddClassParameters {
    addClass: string;

    element: string;
}
