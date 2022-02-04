/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { AngularServices } from "../services/angular.service";
import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IInterpolateService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { StateService, Transition, StateDeclaration } from "@uirouter/angularjs";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "mdUiSrefActive",
    dependencies: [AngularServices.interpolate, AngularServices.state, AngularServices.transitions],
})
export class MdUiSrefActiveDirective extends DirectiveBase {
    constructor(private interpolate: IInterpolateService, private state: StateService, private transitions: Transition) {
        super();
    }

    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        var cssClass = instanceAttributes["mdUiSrefActive"];
        var state = this.interpolate(instanceAttributes["mdUiSref"] || instanceAttributes["uiSref"])(scope);

        function update(toState: StateDeclaration): void {
            if (ObjectExtensions.isNull(toState) || ObjectExtensions.isNull(toState.name)) return;

            if ((toState.name as string).indexOf(state) !== -1) {
                instanceElement.addClass(cssClass);
            } else {
                instanceElement.removeClass(cssClass);
            }
        }

        update(this.state.current);

        instanceElement["transition-event"] = this.transitions.onSuccess({}, () => {
            update(this.state.current);
        });
    }

    protected onDestroy(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        var hookOff = instanceElement["transition-event"];

        if (!ObjectExtensions.isNull(hookOff)) {
            instanceElement["transition-event"]();
            instanceElement["transition-event"] = null;
        }

        super.onDestroy(scope, instanceElement, instanceAttributes, controller, transclude);
    }

    static factory(interpolate: IInterpolateService, state: StateService, transitions: Transition): MdUiSrefActiveDirective {
        return new MdUiSrefActiveDirective(interpolate, state, transitions);
    }
}
