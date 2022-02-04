/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IRegistrable, registrableMetadataKey } from "./registrable";
import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";

export function Directive(parameters: IDirective): <T>(constructor: { new (...args: any[]): T }) => void {
    if (ObjectExtensions.isNull(parameters)) throw new Error("Can not register a directive without an instance of IDirective.");

    return <T>(constructor: { new (...args: any[]): T }): void => {
        if (ObjectExtensions.isNull(constructor)) throw new Error("Missing directive constructor.");

        if (ObjectExtensions.isNull(parameters.name)) parameters.name = FunctionExtensions.getFunctionName(constructor);

        if (ObjectExtensions.isNull(parameters.restrict)) parameters.restrict = "A";

        if (ObjectExtensions.isNull(parameters.factory)) parameters.factory = constructor["factory"];

        if (ObjectExtensions.isNull(parameters.factory)) throw new Error("Missing directive factory.");

        constructor[registrableMetadataKey] = parameters;

        if (!ObjectExtensions.isNull(parameters.module)) {
            parameters.module.registerDirective(constructor);
        }
    };
}

export interface IDirective extends IRegistrable {
    factory?: Function;

    controller?: Function;

    controllerAs?: string;

    templateUrl?: string;

    template?: string;

    bindings?: { [property: string]: string };

    transclude?: boolean | { [slot: string]: string };

    restrict?: "A" | "E" | "EA";

    require?: string | string[] | { [controller: string]: string };
}

export const scopeInfoKey = "$scopeInfo";
