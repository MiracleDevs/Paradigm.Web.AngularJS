/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";

@Directive({
    name: "fullSelect",
})
export class FullSelectDirective extends DirectiveBase {
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        instanceElement.on("focus", () => (instanceElement as any).select());
    }

    static factory(): FullSelectDirective {
        return new FullSelectDirective();
    }
}
