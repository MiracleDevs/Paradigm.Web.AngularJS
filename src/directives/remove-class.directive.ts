/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import  * as $ from "jquery";

@Directive({
    name: "removeClass"
})
export class RemoveClassDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        const options = {} as IRemoveClassParameters;

        this.tryGet(options, instanceAttributes, "element");
        this.tryGet(options, instanceAttributes, "removeClass");

        if (!ObjectExtensions.isNull(options.element))
        {
            const element = $(options.element);

            if (element.hasClass(options.removeClass))
            {
                element.removeClass(options.removeClass);
            }
        }
    }

    static factory(): RemoveClassDirective
    {
        return new RemoveClassDirective();
    }
}

export interface IRemoveClassParameters
{
    removeClass: string;

    element: string;
}