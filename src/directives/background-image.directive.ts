/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { StringExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "backgroundImage",
    dependencies: [AngularServices.interpolate]
})
export class BackgroundImageDirective extends DirectiveBase
{
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        scope.$watch(() => instanceAttributes["backgroundImage"], (newValue) =>
        {
            if (StringExtensions.isNullOrWhiteSpace(newValue))
                return;

                instanceElement.css("background-image", StringExtensions.format("url({0})", newValue));
        });
    }

    static factory(): BackgroundImageDirective
    {
        return new BackgroundImageDirective();
    }
}