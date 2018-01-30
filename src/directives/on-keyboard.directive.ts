/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { KeyProcessorService } from "../services/key-processor.service";

@Directive({
    name: "onKeyboard",
    dependencies: [KeyProcessorService]
})
export class OnKeyboardDirective extends DirectiveBase
{
    constructor(private keyProcessor: KeyProcessorService)
    {
        super();
    }

    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var keyActions = this.keyProcessor.parseActions(instanceAttributes["onKeyboard"]);

        if (keyActions.any(x => x.eventType === "keypress"))
            instanceElement.keypress(e => this.keyProcessor.evaluateKeyActions(keyActions, "keypress", scope, e as any));

        if (keyActions.any(x => x.eventType === "keydown"))
            instanceElement.keydown(e => this.keyProcessor.evaluateKeyActions(keyActions, "keydown", scope, e as any));

        if (keyActions.any(x => x.eventType === "keyup"))
            instanceElement.keyup(e => this.keyProcessor.evaluateKeyActions(keyActions, "keyup", scope, e as any));
    }

    static factory(keyProcessor: KeyProcessorService): OnKeyboardDirective
    {
        return new OnKeyboardDirective(keyProcessor);
    }
}