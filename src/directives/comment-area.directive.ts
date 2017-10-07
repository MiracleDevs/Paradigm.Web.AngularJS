/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Directive } from "../decorators/directive";
import { DirectiveBase } from "./base.directive";
import { IScope, IAttributes, ITranscludeFunction, IController } from "angular";
import { ObjectExtensions, StringExtensions } from "@miracledevs/paradigm-ui-web-shared";
import  * as $ from "jquery";

@Directive({
    name: "commentArea",
    require: "ngModel",
    bindings: {
        ngModel: "="
    }
})
export class CommentAreaDirective extends DirectiveBase
{
    protected create(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        var options = {} as ICommentAreaParameters;

        this.tryGetNumber(options, instanceAttributes, "defaultHeight");
        this.tryGetNumber(options, instanceAttributes, "maxSize");
        this.tryGet(options, instanceAttributes, "maxSizeField");
        this.tryGet(options, instanceAttributes, "maxSizeText");
        this.tryGetBoolean(options, instanceAttributes, "resize");
        this.tryGetBoolean(options, instanceAttributes, "showAlways");
        this.tryGetBoolean(options, instanceAttributes, "restrictEntry");
        this.tryGet(options, instanceAttributes, "negativeClass");

        if (options.restrictEntry)
        {
            instanceElement.on("keydown", event => this.restrictEntry(event, options, instanceElement, false));
            instanceElement.on("keypress", event => this.restrictEntry(event, options, instanceElement, true));
            instanceElement.on("keyup", event => this.restrictEntry(event, options, instanceElement, false));
            scope.$watch(() => scope["ngModel"], () => this.restrictEntry(null, options, instanceElement, false));
        }
        else
        {
            instanceElement.on("keypress", () => this.showCharacterLeft(options, instanceElement, true));
            scope.$watch(() => scope["ngModel"], () => this.showCharacterLeft(options, instanceElement, false));
        }
    }

    private restrictEntry(event: any, options: ICommentAreaParameters, element: JQuery, cancel: boolean): void
    {
        if (!ObjectExtensions.isNull(options.maxSize))
        {
            const value = element.val() as string;
            const length = value.length;
            let available = options.maxSize - length;

            if (available < 0)
                available = -1;

            if (available === -1)
            {
                if (cancel)
                {
                    event.stopPropagation();
                    event.preventDefault();
                }

                element.val(value.substr(0, options.maxSize));
                available = 0;
            }

            if (!ObjectExtensions.isNull(options.maxSizeText))
            {
                $(options.maxSizeField).text((available === options.maxSize && !options.showAlways) ? "" : StringExtensions.format(options.maxSizeText, available));
            }

            if (!ObjectExtensions.isNull(options.resize) && options.resize)
            {
                this.checkSize(options, element);
            }
        }
    }

    private showCharacterLeft(options: ICommentAreaParameters, element: JQuery, cancel: boolean): void
    {
        if (!ObjectExtensions.isNull(options.maxSize))
        {
            const value = element.val() as string;
            const length = value.length;
            const available = options.maxSize - length;

            if (!ObjectExtensions.isNull(options.maxSizeText))
            {
                const field = $(options.maxSizeField);

                if (!ObjectExtensions.isNull(options.negativeClass))
                {
                    if (available < 0)
                        field.addClass(options.negativeClass);
                    else
                        field.removeClass(options.negativeClass);
                }

                $(options.maxSizeField).text((available === options.maxSize && !options.showAlways) ? "" : StringExtensions.format(options.maxSizeText, available));
            }

            if (!ObjectExtensions.isNull(options.resize) && options.resize)
            {
                this.checkSize(options, element);
            }
        }
        else
        {
            if (!ObjectExtensions.isNull(options.resize) && options.resize)
            {
                this.checkSize(options, element);
            }
        }
    }

    private checkSize(options: ICommentAreaParameters, element: JQuery): void
    {
        const control = element[0];
        const defaultHeight = options.defaultHeight || 0;
        control.style.height = "1px";

        if (control.scrollHeight > control.clientHeight)
        {
            if (control.scrollHeight > defaultHeight)
                control.style.height = control.scrollHeight + "px";
            else
                control.style.height = defaultHeight + "px";
        }
        else if (!ObjectExtensions.isNull(options.defaultHeight))
        {
            control.style.height = defaultHeight + "px";
        }
    }

    static factory(): CommentAreaDirective
    {
        return new CommentAreaDirective();
    }
}

export interface ICommentAreaParameters
{
    defaultHeight?: number;

    maxSize?: number;

    showAlways?: boolean;

    maxSizeField?: string;

    maxSizeText?: string;

    resize?: boolean;

    restrictEntry?: boolean;

    negativeClass?: string;
}
