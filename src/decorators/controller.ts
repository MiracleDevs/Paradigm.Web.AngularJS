/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IRegistrable, registrableMetadataKey } from "./registrable";
import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { ParamDeclaration } from "@uirouter/angularjs";

export function Controller(parameters: IController): <T>(constructor: { new (...args: any[]): T }) => void {
    if (ObjectExtensions.isNull(parameters)) throw new Error("Can not register a controller without an instance of IController.");

    return <T>(constructor: { new (...args: any[]): T }): void => {
        if (ObjectExtensions.isNull(constructor)) throw new Error("Missing controller constructor.");

        if (ObjectExtensions.isNull(parameters.name)) parameters.name = FunctionExtensions.getFunctionName(constructor);

        if (ObjectExtensions.isNull(parameters.controllerAs)) parameters.controllerAs = "controller";

        if (ObjectExtensions.isNull(parameters.controller)) parameters.controller = constructor;

        if (ObjectExtensions.isNull(parameters.controller)) throw new Error("Missing controller constructor.");

        constructor[registrableMetadataKey] = parameters;

        if (!ObjectExtensions.isNull(parameters.module)) {
            parameters.module.registerController(constructor);
        }
    };
}

export interface IController extends IRegistrable {
    stateName?: string;

    stateUrl?: string;

    templateUrl?: string;

    template?: string;

    controller?: Function;

    controllerAs?: string;

    resolve?: Object;

    params?: {
        [key: string]: ParamDeclaration | any;
    };
}
