/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IRegistrable, registrableMetadataKey } from "./registrable";
import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";

export function Service(parameters?: IService): <T>(constructor: { new(...args: any[]): T }) => void
{
    if (ObjectExtensions.isNull(parameters))
        parameters = {};

    return <T>(constructor: { new(...args: any[]): T }): void =>
    {
        if (ObjectExtensions.isNull(constructor))
            throw new Error("Missing service constructor.");

        if (ObjectExtensions.isNull(parameters.factory))
            parameters.factory = constructor["factory"];

        if (ObjectExtensions.isNull(parameters.factory))
            throw new Error("Missing service factory.");

        if (ObjectExtensions.isNull(parameters.name))
            parameters.name = FunctionExtensions.getFunctionName(constructor);

        constructor[registrableMetadataKey] = parameters;

        if (!ObjectExtensions.isNull(parameters.module))
        {
            parameters.module.registerService(constructor);
        }
    };
}

export interface IService extends IRegistrable
{
    factory?: Function;
}