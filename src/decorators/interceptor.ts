/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IRegistrable, registrableMetadataKey } from "./registrable";
import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";

export function Interceptor(parameters: IInterceptor): <T>(constructor: { new (...args: any[]): T }) => void {
    if (ObjectExtensions.isNull(parameters)) throw new Error("Can not register an interceptor without an instance of IInterceptor.");

    return <T>(constructor: { new (...args: any[]): T }): void => {
        if (ObjectExtensions.isNull(constructor)) throw new Error("Missing interceptor constructor.");

        if (ObjectExtensions.isNull(parameters.factory)) parameters.factory = constructor["factory"];

        if (ObjectExtensions.isNull(parameters.factory)) throw new Error("Missing interceptor factory.");

        if (ObjectExtensions.isNull(parameters.name)) parameters.name = FunctionExtensions.getFunctionName(constructor);

        constructor[registrableMetadataKey] = parameters;

        if (!ObjectExtensions.isNull(parameters.module)) {
            parameters.module.registerInterceptor(constructor);
        }
    };
}
export interface IInterceptor extends IRegistrable {
    factory?: Function;
}
