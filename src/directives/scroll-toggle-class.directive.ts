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
    name: "scrollToggleClass"
})
export class ScrollToggleClassDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var self = this;

        function updateElement(): void
        {
            self.updateElement(instanceElement, instanceAttributes);
        }

        $(window).on("scroll.scrollToggleClass", updateElement);
        this.updateElement(instanceElement, instanceAttributes);
    }

    private updateElement(element: JQuery, instanceAttributes: IAttributes): void
    {
        const options = {} as IScrollToggleClassParameters;

        this.tryGetNumber(options, instanceAttributes, "minPos");
        this.tryGetNumber(options, instanceAttributes, "maxPos");
        this.tryGet(options, instanceAttributes, "cssClass");

        options.minPos = options.minPos || Number.MIN_VALUE;
        options.maxPos = options.maxPos || Number.MAX_VALUE;

        const scroll = $(window).scrollTop();

        if (scroll >= options.minPos && scroll <= options.maxPos)
            element.addClass(options.cssClass);
        else
            element.removeClass(options.cssClass);
    }

    protected dispose(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        $(window).unbind("scroll.scrollToggleClass");
        super.dispose(scope, instanceElement, instanceAttributes, controller, transclude);
    }

    static factory(): ScrollToggleClassDirective
    {
        return new ScrollToggleClassDirective();
    }
}

export interface IScrollToggleClassParameters
{
    forceAdd: boolean;

    forceRemove: boolean;

    minPos: number;

    maxPos: number;

    cssClass: string;
}