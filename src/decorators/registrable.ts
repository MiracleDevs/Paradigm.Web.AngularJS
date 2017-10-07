/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IModule } from "../module.interface";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

export interface IRegistrable
{
    name?: string;

    dependencies?: Array<string | Function>;

    module?: IModule;
}

export const registrableMetadataKey = "$registrableMetadata";

export function getRegistrableName(constructor: Function): string
{
    if (ObjectExtensions.isNull(constructor) ||
        ObjectExtensions.isNull(constructor[registrableMetadataKey]) ||
        ObjectExtensions.isNull(constructor[registrableMetadataKey].name))
        return null;

    return constructor[registrableMetadataKey].name;
}

export function getRegistrableInfo<T>(constructor: Function): IRegistrable
{
    if (ObjectExtensions.isNull(constructor[registrableMetadataKey]))
        return null;

    return constructor[registrableMetadataKey];
}