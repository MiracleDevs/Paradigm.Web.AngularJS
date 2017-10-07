/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { ServiceBase } from "./base.service";
import { Service } from "../decorators/service";
import { AngularServices } from "./angular.service";
import { IParseService, IScope, ICompiledExpression } from "angular";
import { ArrayList, ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Service({ name: "$pd-keyProcessorService", dependencies: [AngularServices.parse] })
export class KeyProcessorService extends ServiceBase
{
    constructor(private parse: IParseService)
    {
        super();
    }

    evaluateKeyActions(keyActions: ArrayList<KeyAction>, eventType: string, scope: IScope, e: JQueryKeyEventObject): void
    {
        keyActions.where(x => x.eventType === eventType).forEach(keyAction =>
        {
            if (e.keyCode === keyAction.keyCode &&
                ((ObjectExtensions.isNull(keyAction.shift)) ||
                    (!ObjectExtensions.isNull(keyAction.shift) && keyAction.shift && e.shiftKey) ||
                    (!ObjectExtensions.isNull(keyAction.shift) && !keyAction.shift && !e.shiftKey)) &&

                ((ObjectExtensions.isNull(keyAction.alt)) ||
                    (!ObjectExtensions.isNull(keyAction.alt) && keyAction.alt && e.altKey) ||
                    (!ObjectExtensions.isNull(keyAction.alt) && !keyAction.alt && !e.altKey)) &&

                ((ObjectExtensions.isNull(keyAction.ctrl)) ||
                    (!ObjectExtensions.isNull(keyAction.ctrl) && keyAction.ctrl && e.ctrlKey) ||
                    (!ObjectExtensions.isNull(keyAction.ctrl) && !keyAction.ctrl && !e.ctrlKey)))
            {
                scope.$apply(() =>
                {
                    keyAction.action(scope, { $event: e });
                });
            }
        });
    }

    parseActions(text: string): ArrayList<KeyAction>
    {
        const keyActions = new ArrayList<KeyAction>();
        const actionStrings = text.split("|");

        for (let i = 0; i < actionStrings.length; i++)
        {
            const keyAction = new KeyAction();
            const actionString = actionStrings[i];

            const parts = actionString.split(":");

            if (parts.length !== 2)
                throw new Error(`The key-submit expression number ${i} is incorrect. Should be event(keycode,[shift],[alt],[ctrl]): action`);

            const firstParenthesis = parts[0].indexOf("(");
            const lastParenthesis = parts[0].indexOf(")");

            if (firstParenthesis < 0 || lastParenthesis < 0)
                throw new Error(`The key-submit expression number ${i} is incorrect. Should be event(keycode,[shift],[alt],[ctrl]): action`);

            const eventType = parts[0].substr(0, firstParenthesis);

            if (eventType !== "keypress" &&
                eventType !== "keydown" &&
                eventType !== "keyup")
                throw new Error(`Only keypress, keydown and keyup events are allowed on action strings.`);

            const keys = parts[0].substr(firstParenthesis + 1, lastParenthesis - firstParenthesis - 1);
            const parameters = new ArrayList(keys.split(","));

            try
            {
                keyAction.eventType = eventType;
                keyAction.action = this.parse(parts[1]);
                keyAction.keyCode = parseInt(parameters.get(0), 10);
            }
            catch (error)
            {
                throw new Error(`The key-submit expression number ${i} is incorrect. Should be event(keycode,[shift],[alt],[ctrl]): action.`);
            }

            if (parameters.any(x => x === "shift"))
                keyAction.shift = true;
            else if (parameters.any(x => x === "!shift"))
                keyAction.shift = false;

            if (parameters.any(x => x === "ctrl"))
                keyAction.ctrl = true;
            else if (parameters.any(x => x === "!ctrl"))
                keyAction.ctrl = false;

            if (parameters.any(x => x === "alt"))
                keyAction.alt = true;
            else if (parameters.any(x => x === "!alt"))
                keyAction.alt = false;

            keyActions.add(keyAction);
        }

        return keyActions;
    }

    static factory(parse: IParseService): KeyProcessorService
    {
        return new KeyProcessorService(parse);
    }
}

export class KeyAction
{
    eventType: string;

    keyCode: number;

    shift: boolean;

    ctrl: boolean;

    alt: boolean;

    action: ICompiledExpression;
}