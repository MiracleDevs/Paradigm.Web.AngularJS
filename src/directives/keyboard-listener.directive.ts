/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { KeyProcessorService, KeyAction } from "../services/key-processor.service";
import { ArrayList } from "@miracledevs/paradigm-ui-web-shared";
import { IAttributes, IController, ITranscludeFunction, IScope } from "angular";
import  * as $ from "jquery";

@Directive({
    name: "keyboardListener",
    restrict: "E",
    bindings: {
        disabled: "=",
        attachTo: "@"
    },
    dependencies: [KeyProcessorService]
})
export class KeyboardListenerDirective extends DirectiveBase
{
    constructor(private keyProcessor: KeyProcessorService)
    {
        super();
    }

    protected create(scope: IKeyboardListenerScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var actions = "";
        var attachTo = $(scope.attachTo || document);

        instanceElement.find("listener").each((index, element) =>
        {
            actions += element.getAttribute("action") + "|";
        });

        if (actions[actions.length - 1] === "|")
            actions = actions.substr(0, actions.length - 1);

        var keyActions = this.keyProcessor.parseActions(actions);
        var keyProcessor = this.keyProcessor;

        function evaluateKeyPress(e: JQueryKeyEventObject): void
        {
            if (scope.disabled)
                return;

            keyProcessor.evaluateKeyActions(keyActions, "keypress", scope.$parent, e);
        }

        function evaluateKeyDown(e: JQueryKeyEventObject): void
        {
            if (scope.disabled)
                return;

            keyProcessor.evaluateKeyActions(keyActions, "keydown", scope.$parent, e);
        }

        function evaluateKeyUp(e: JQueryKeyEventObject): void
        {
            if (scope.disabled)
                return;

            keyProcessor.evaluateKeyActions(keyActions, "keyup", scope.$parent, e);
        }

        if (keyActions.any(x => x.eventType === "keypress"))
            attachTo.on("keypress.documentKeyboard", evaluateKeyPress);

        if (keyActions.any(x => x.eventType === "keydown"))
            attachTo.on("keydown.documentKeyboard", evaluateKeyDown);

        if (keyActions.any(x => x.eventType === "keyup"))
            attachTo.on("keyup.documentKeyboard", evaluateKeyUp);
    }

    protected dispose(scope: IKeyboardListenerScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var attachTo = $(scope.attachTo || document);

        attachTo.off("keypress.documentKeyboard");
        attachTo.off("keydown.documentKeyboard");
        attachTo.off("keyup.documentKeyboard");

        super.dispose(scope, instanceElement, instanceAttributes, controller, transclude);
    }

    static factory(keyProcessor: KeyProcessorService): KeyboardListenerDirective
    {
        return new KeyboardListenerDirective(keyProcessor);
    }
}


export interface IKeyboardListenerScope extends IScope
{
    disabled: boolean;

    attachTo: string;

    $parent: IScope;
}