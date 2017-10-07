/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { DirectiveBase } from "./base.directive";
import { IRootScopeService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";

@Directive({
    name: "scrollToBottom",
    restrict: "A"
})
export class ScrollToBottomDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        const options = {} as IScrollToBottomParameters;

        this.tryGetBoolean(options, instanceAttributes, "onContentChange");
        this.tryGetBoolean(options, instanceAttributes, "onClick");

        if (options.onContentChange)
        {
            scope.$watch(() => instanceElement[0].innerHTML, () => instanceElement.scrollTop(instanceElement[0].scrollHeight));
        }

        if (options.onClick)
        {
            instanceElement.on("click", () => instanceElement.scrollTop(0));
        }
    }

    static factory(): ScrollToBottomDirective
    {
        return new ScrollToBottomDirective();
    }
}

export interface IScrollToBottomParameters
{
    onClick: boolean;

    onContentChange: boolean;
}
