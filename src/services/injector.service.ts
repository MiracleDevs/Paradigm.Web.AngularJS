/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { AngularServices } from "./angular.service";
import { ServiceBase } from "./base.service";
import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { auto } from "angular";
import { Service } from "../decorators/service";
import { getRegistrableName } from "../decorators/registrable";

@Service({ name: "$pd-injectorService", dependencies: [AngularServices.injector] })
export class InjectorService extends ServiceBase
{
    constructor(private injector: auto.IInjectorService)
    {
        super();
    }

    get<T>(service: string | { new(...args: any[]): T }): T
    {
        if (ObjectExtensions.isNull(service))
            return null;

        if (ObjectExtensions.getTypeName(service) === "String")
            return this.injector.get<T>(service as string);

        return this.injector.get<T>(getRegistrableName((service as Function)) ||
                                    FunctionExtensions.getFunctionName(service as Function));
    }

    static factory(injector: auto.IInjectorService): InjectorService
    {
        return new InjectorService(injector);
    }
}