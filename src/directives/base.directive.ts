/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IDirective, IScope, IAttributes, IController, ITranscludeFunction, IPromise } from "angular";
import { StringExtensions, ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { IDirective as IOwnDirective } from "../decorators/directive";
import { registrableMetadataKey } from "../decorators/registrable";
import * as $ from "jquery";

export abstract class DirectiveBase implements IDirective
{
    link: (scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction) => void;

    constructor()
    {
        var decorator = this.constructor[registrableMetadataKey] as IOwnDirective;

        if (!ObjectExtensions.isNull(decorator))
        {
            for (var key in decorator)
            {
                if (decorator.hasOwnProperty(key))
                {
                    var destinationKey = (key === "bindings") ? "scope" : key;
                    this[destinationKey] = decorator[key];
                }
            }
        }

        this.link = (s, e, a, c, t) =>
        {
            var element = $(e);
            this.onInit(s, element, a, c, t);
            s.$on("$destroy", () => this.onDestroy(s, element, a, c, t));
        };
    }

    protected abstract onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void;

    protected onDestroy(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void
    {
        instanceElement.remove();
    }

    protected call<T>(
        call: () => IPromise<T>,
        success?: (result: T) => void,
        loading?: (loading: boolean) => void,
        fail?: (reason: any) => void): void
    {
        if (!ObjectExtensions.isNull(loading))
            loading(true);

        call()
            .then(result =>
            {
                if (!ObjectExtensions.isNull(loading))
                    loading(false);

                if (!ObjectExtensions.isNull(success))
                {
                    success(result);
                }
            })
            .catch(error =>
            {
                if (!ObjectExtensions.isNull(loading))
                    loading(false);

                if (!ObjectExtensions.isNull(fail))
                    fail(error);
            });
    }

    protected getOptions<T>(instanceAttributes: IAttributes, optionsParameter: string): T
    {
        if (StringExtensions.isNullOrWhiteSpace(instanceAttributes[optionsParameter]))
            return null;

        return JSON.parse(instanceAttributes[optionsParameter]) as T;
    }

    protected tryGetInt(options: any, instanceAttributes: IAttributes, optionFrom: string, optionTo?: string): number
    {
        optionTo = optionTo || optionFrom;

        if (!ObjectExtensions.isNull(instanceAttributes[optionFrom]))
            options[optionTo] = parseInt(instanceAttributes[optionFrom], 10);

        return options[optionTo];
    }

    protected tryGetNumber(options: any, instanceAttributes: IAttributes, optionFrom: string, optionTo?: string): number
    {
        optionTo = optionTo || optionFrom;

        if (!ObjectExtensions.isNull(instanceAttributes[optionFrom]))
            options[optionTo] = parseFloat(instanceAttributes[optionFrom]);

        return options[optionTo];
    }

    protected tryGetDate(options: any, instanceAttributes: IAttributes, optionFrom: string, optionTo?: string): number
    {
        optionTo = optionTo || optionFrom;

        if (!ObjectExtensions.isNull(instanceAttributes[optionFrom]))
            options[optionTo] = new Date(instanceAttributes[optionFrom]);

        return options[optionTo];
    }

    protected tryGetBoolean(options: any, instanceAttributes: IAttributes, optionFrom: string, optionTo?: string): boolean
    {
        optionTo = optionTo || optionFrom;

        if (!ObjectExtensions.isNull(instanceAttributes[optionFrom]))
        {
            const value = instanceAttributes[optionFrom].toLowerCase();
            options[optionTo] = value === "yes" ||
                value === "true" ||
                value === "1";
        }

        return options[optionTo];
    }

    protected tryGet(options: any, instanceAttributes: IAttributes, optionFrom: string, optionTo?: string): string
    {
        optionTo = optionTo || optionFrom;

        if (!ObjectExtensions.isNull(instanceAttributes[optionFrom]))
            options[optionTo] = instanceAttributes[optionFrom];

        return options[optionTo];
    }
}