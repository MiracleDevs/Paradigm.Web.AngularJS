/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { AngularServices } from "../services/angular.service";
import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { ITimeoutService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Directive({
    name: "fileButton",
    restrict: "E",
    bindings: {
        title: "@",
        ariaLabel: "@",
        accept: "@",
        caption: "@",
        cssClass: "@",
        fileSelected: "&",
    },
    template: '<input type="file" style="display: none" title="{{title}}" accept="{{accept}}" aria-label="{{ariaLabel}}" /><button type="button" class="{{cssClass}}">{{caption}}</button>',
    dependencies: [AngularServices.timeout],
})
export class FileButtonDirective extends DirectiveBase {
    private timeout: ITimeoutService;

    constructor(timeout: ITimeoutService) {
        super();
        this.timeout = timeout;
    }

    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        const button = instanceElement.find("button");
        var file = instanceElement.find("input");

        button.on("click", () => file.trigger("click"));
        file.on("change", e => {
            this.timeout(() => {
                if (ObjectExtensions.isNull(e) || ObjectExtensions.isNull(e.target) || ObjectExtensions.isNull(e.target["files"])) return;

                scope["fileSelected"]({ files: e.target["files"] });
            });
        });
    }

    static factory(timeout: ITimeoutService): FileButtonDirective {
        return new FileButtonDirective(timeout);
    }
}
