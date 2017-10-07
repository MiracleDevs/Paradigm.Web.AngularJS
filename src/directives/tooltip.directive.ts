/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import { ObjectExtensions, StringExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "tooltip",
    bindings: {
        tooltipOptions: "@",
        tooltipCose: "&",
        tooltipParameter: "="
    }
})
export class TooltipDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        const options = this.getOptions<ITooltipOptions>(instanceAttributes, "tooltipsterOptions");

        if (ObjectExtensions.isNull(options) || ObjectExtensions.isNull(options.content))
        {
            this.normalTooltip(instanceElement, scope, instanceAttributes);
        }

        (instanceElement as any).tooltipster(options);
    }

    private normalTooltip(control: JQuery, scope: IScope, instanceAttributes: IAttributes): void
    {
        scope.$watch(() => instanceAttributes["title"], newValue =>
        {
            if (StringExtensions.isNullOrWhiteSpace(newValue))
                return;

            var tooltipsterData = control.data("tooltipster-ns");

            if (!ObjectExtensions.isNull(tooltipsterData))
            {
                control.removeAttr("title");
                (control as any).tooltipster("content", newValue);
            }
        });
    }

    static factory(): TooltipDirective
    {
        return new TooltipDirective();
    }
}

export interface ITooltipOptions
{
    animation: "fade" | "grow" | "swing" | "slide" | "fall";
    animationDuration: number | number[];
    arrow: boolean;
    content: string | JQuery | any;
    contentAsHTML: boolean;
    contentCloning: boolean;
    debug: boolean;
    delay: number | number[];
    delayTouch: number | number[];
    distance: number | number[];
    IEmin: number;
    interactive: boolean;
    maxWidth: number;
    minIntersection: number;
    minWidth: number;
    multiple: boolean;
    plugins: string[];
    repositionOnScroll: boolean;
    restoration: "none" | "previous" | "current";
    selfDestruction: boolean;
    side: string | string[];
    timer: number;
    theme: string | string[];
    trackerInterval: number;
    trackOrigin: boolean;
    trackTooltip: boolean;
    trigger: "hover" | "click" | "custom";
    triggerClose: any;
    triggerOpen: any;
    updateAnimation: "fade" | "rotate" | "scale";
    viewportAware: boolean;
    zIndex: number;
}