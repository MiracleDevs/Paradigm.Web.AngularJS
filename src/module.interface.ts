/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { IModule as IAngularModule } from "angular";

export interface IModule
{
    getModule(): IAngularModule;

    getModuleName(): string;

    registerControllers(controllers: Function[]): void;

    registerController(controller: Function): void;

    registerComponents(components: Function[]): void;

    registerComponent(component: Function): void;

    registerServices(services: Function[]): void;

    registerService(service: Function): void;

    registerLoggingService(service: Function): void;

    registerInterceptors(interceptors: Function[]): void;

    registerInterceptor(interceptor: Function): void;

    registerFilters(filters: Function[]): void;

    registerFilter(filter: Function): void;

    registerDirectives(directives: Function[]): void;

    registerDirective(directive: Function): void;
}