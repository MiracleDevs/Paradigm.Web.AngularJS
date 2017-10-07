/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { Transition } from "@uirouter/angularjs";
import  * as $ from "jquery";

@Directive({
    name: "scrollToTop",
    dependencies: [AngularServices.transitions]
})
export class ScrollToTopDirective extends DirectiveBase
{
    constructor(private transitions: Transition)
    {
        super();
    }

    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        const options = {} as IScrollToTopParameters;

        this.tryGetBoolean(options, instanceAttributes, "onStateChange");
        this.tryGetBoolean(options, instanceAttributes, "onClick");

        scope.$watch(() => instanceAttributes["onStateChange"], (newValue) =>
        {
            if (newValue === "true")
            {
                if (ObjectExtensions.isNull(instanceElement[0]["stateChangeEvent"]))
                {
                    instanceElement[0]["stateChangeEvent"] = this.transitions.onSuccess({}, () =>
                    {
                        $("body").scrollTop(0);
                    });
                }
            }
            else
            {
                if (!ObjectExtensions.isNull(instanceElement[0]["stateChangeEvent"]))
                {
                    instanceElement[0]["stateChangeEvent"]();
                    instanceElement[0]["stateChangeEvent"] = null;
                }
            }
        });

        if (options.onClick)
        {
            instanceElement.on("click", () =>
            {
                $("body").scrollTop(0);
            });
        }
    }

    static factory(transitions: Transition): ScrollToTopDirective
    {
        return new ScrollToTopDirective(transitions);
    }
}

export interface IScrollToTopParameters
{
    onStateChange: boolean;

    onClick: boolean;
}