/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { Directive } from "../decorators/directive";

@Directive({
    name: "fileDragAndDrop",
})
export class FileDragAndDropDirective extends DirectiveBase {
    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        instanceElement[0].addEventListener("dragenter", () => instanceElement.addClass("file-drag-enter"), false);
        instanceElement[0].addEventListener("dragexit", () => instanceElement.removeClass("file-drag-enter"), false);
        instanceElement[0].addEventListener("dragend", () => instanceElement.removeClass("file-drag-enter"), false);
        instanceElement[0].addEventListener("dragleave", () => instanceElement.removeClass("file-drag-enter"), false);

        instanceElement[0].addEventListener(
            "dragover",
            e => {
                instanceElement.addClass("file-drag-enter");
                e.dataTransfer.dropEffect = "copy";

                e.stopPropagation();
                e.preventDefault();
            },
            false
        );

        instanceElement[0].addEventListener(
            "drop",
            e => {
                scope.$eval(instanceAttributes["fileSelected"], { files: e.dataTransfer.files });
                instanceElement.removeClass("file-drag-enter");

                e.stopPropagation();
                e.preventDefault();
            },
            false
        );
    }

    static factory(): FileDragAndDropDirective {
        return new FileDragAndDropDirective();
    }
}
