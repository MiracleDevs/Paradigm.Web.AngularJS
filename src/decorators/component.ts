/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IRegistrable, registrableMetadataKey } from "./registrable";
import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";

function addBinding(binding: string, target: Object, propertyKey: string | symbol)
{
    if (ObjectExtensions.isNull(target) ||
        ObjectExtensions.isNull(target.constructor) ||
        ObjectExtensions.isNull(propertyKey))
        throw new Error("Missing target or propery.");

    var constructor = target.constructor;
    var parameters = constructor[registrableMetadataKey] as IComponent;

    if (ObjectExtensions.isNull(parameters))
        parameters = constructor[registrableMetadataKey] = {};

    if (ObjectExtensions.isNull(parameters.bindings))
        parameters.bindings = {};

    parameters.bindings[propertyKey] = binding;
}

export function Component(parameters: IComponent): <T>(constructor: { new(...args: any[]): T }) => void
{
    if (ObjectExtensions.isNull(parameters))
        throw new Error("Can not register a component without an instance of IComponent.");

    return <T>(constructor: { new(...args: any[]): T }): void =>
    {
        if (ObjectExtensions.isNull(constructor))
            throw new Error("Missing component constructor.");

        if (!ObjectExtensions.isNull(constructor[registrableMetadataKey]))
        {
            var params = constructor[registrableMetadataKey] as IComponent;

            if (!ObjectExtensions.isNull(params.bindings))
                parameters.bindings = params.bindings;

            if (!ObjectExtensions.isNull(params.require))
                parameters.require = params.require;
        }

        if (ObjectExtensions.isNull(parameters.name))
            parameters.name = FunctionExtensions.getFunctionName(constructor);

        if (ObjectExtensions.isNull(parameters.controllerAs))
            parameters.controllerAs = "controller";

        if (ObjectExtensions.isNull(parameters.controller))
            parameters.controller = constructor;

        if (ObjectExtensions.isNull(parameters.controller))
            throw new Error("Missing component constructor.");

        constructor[registrableMetadataKey] = parameters;

        if (!ObjectExtensions.isNull(parameters.module))
        {
            parameters.module.registerComponent(constructor);
        }
    }
}

export function InputBinding(target: Object, propertyKey: string | symbol)
{
    addBinding("<", target, propertyKey);
}

export function OutputBinding(target: Object, propertyKey: string | symbol)
{
    addBinding("&", target, propertyKey);
}

export function TextBinding(target: Object, propertyKey: string | symbol)
{
    addBinding("@", target, propertyKey);
}

export function TwoWayBinding(target: Object, propertyKey: string | symbol)
{
    addBinding("=", target, propertyKey);
}

export function Require(controller: string | Function, searchOnParents: boolean = false): Function
{
    return (target: Object, propertyKey: string | symbol) =>
    {
        if (ObjectExtensions.isNull(target) ||
            ObjectExtensions.isNull(target.constructor) ||
            ObjectExtensions.isNull(propertyKey))
            throw new Error("Missing target or propery.");

        var constructor = target.constructor;
        var parameters = constructor[registrableMetadataKey] as IComponent;

        if (ObjectExtensions.isNull(parameters))
            parameters = constructor[registrableMetadataKey] = {};

        if (ObjectExtensions.isNull(parameters.require))
            parameters.require = {};

        var controllerName = (ObjectExtensions.getTypeName(controller) === "Function")
            ? FunctionExtensions.getFunctionName(controller as Function)
            : controller as string;

        if (searchOnParents)
            controllerName = "^" + controllerName;

        parameters.require[propertyKey] = controllerName;
    }
}

export interface IComponent extends IRegistrable
{
    controller?: Function;

    controllerAs?: string;

    templateUrl?: string;

    template?: string;

    bindings?: { [boundProperty: string]: string };

    transclude?: boolean | { [slot: string]: string };

    require?: { [controller: string]: string };

    resolve?: Object;
}