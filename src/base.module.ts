/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { module, IHttpProvider, IModule as IAngularModule, ILocationProvider, IScope, auto, translate } from "angular";
import { StateProvider, UrlRouterProvider, StateService, Ng1StateDeclaration } from "@uirouter/angularjs";
import { IController } from "./decorators/controller";
import { IService } from "./decorators/service";
import { IFilter } from "./decorators/filter";
import { IDirective } from "./decorators/directive";
import { IInterceptor } from "./decorators/interceptor";
import { ObjectExtensions, ArrayExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { ControllerBase } from "./controllers/base.controller";
import { LoggingService } from "./services/logging.service";
import { AngularServices } from "./services/angular.service";
import { IModule } from "./module.interface";
import { IComponent } from "./decorators/component";
import { registrableMetadataKey, getRegistrableName } from "./decorators/registrable";

export abstract class ModuleBase implements IModule
{
    protected httpProvider: IHttpProvider;

    protected stateProvider: StateProvider;

    protected interceptorsQueue: Array<Function>;

    protected controllersQueue: Array<Function>;

    protected module: IAngularModule;

    protected logger: LoggingService;

    constructor()
    {
        this.controllersQueue = new Array<Function>();
        this.interceptorsQueue = new Array<Function>();

        this.module = module(this.getModuleName(), this.getModuleDependencies());
        this.register();
        this.module.config([AngularServices.stateProvider, AngularServices.urlRouterProvider, AngularServices.httpProvider, AngularServices.locationProvider, (stateProvider, urlRouterProvider, httpProvider, location) => this.configureRoutes(stateProvider, urlRouterProvider, httpProvider, location)]);
        this.module.config([AngularServices.translateProvider, translateProvider => this.configureTranslator(translateProvider)]);
        this.module.config([AngularServices.compileProvider, compileProvider => compileProvider.debugInfoEnabled(false)]);
        this.module.config([AngularServices.httpProvider, provider => this.registerInterceptorsInternally(provider)]);
        this.module.config([AngularServices.stateProvider, provider => this.registerStates(provider)]);
        this.module.run([AngularServices.rootScope, AngularServices.state, AngularServices.injector, (rootScope, state, injector) => this.authorizeRoute(rootScope, state, injector)]);
    }

    getModule(): IAngularModule
    {
        return this.module;
    }

    getModuleName(): string
    {
        throw new Error("Please override getModuleName method and provide a name for the module.");
    }

    registerControllers(controllers: Function[]): void
    {
        ArrayExtensions.forEach(controllers, x => this.registerController(x));
    }

    registerController(controller: Function): void
    {
        if (ObjectExtensions.isNull(controller) ||
            ObjectExtensions.isNull(controller[registrableMetadataKey]))
            throw new Error(`Problems registering the controller '${FunctionExtensions.getFunctionName(controller)}'.`);

        const controllerInfo = controller[registrableMetadataKey] as IController;

        if (!ObjectExtensions.isNull(controllerInfo.dependencies))
            controller.$inject = this.getDedependencies(controllerInfo.dependencies);

        this.module.controller(controllerInfo.name, controller as any);
        this.logger.debug(`registering ${controllerInfo.name}`);

        if (this.stateProvider == null)
            this.controllersQueue.push(controller);
        else
            this.registerControllerState(controller);
    }

    registerComponents(Components: Function[]): void
    {
        ArrayExtensions.forEach(Components, x => this.registerComponent(x));
    }

    registerComponent(component: Function): void
    {
        if (ObjectExtensions.isNull(component) ||
            ObjectExtensions.isNull(component[registrableMetadataKey]))
            throw new Error(`Problems registering the component '${FunctionExtensions.getFunctionName(component)}'.`);

        const componentInfo = component[registrableMetadataKey] as IComponent;
        const parameters = (this.getDedependencies(componentInfo.dependencies) || new Array<any>()) as Array<any>;
        parameters.push(componentInfo.controller);

        this.module.component(componentInfo.name,
            {
                controller: parameters,
                controllerAs: componentInfo.controllerAs || "component",
                templateUrl: componentInfo.templateUrl,
                template: componentInfo.template,
                bindings: componentInfo.bindings,
                transclude: componentInfo.transclude,
                require: componentInfo.require
            } as angular.IComponentOptions);
        this.logger.debug(`registering ${componentInfo.name}`);
    }


    registerServices(services: Function[]): void
    {
        ArrayExtensions.forEach(services, x => this.registerService(x));
    }

    registerService(service: Function): void
    {
        if (ObjectExtensions.isNull(service) ||
            ObjectExtensions.isNull(service[registrableMetadataKey]))
            throw new Error(`Problems registering the service '${FunctionExtensions.getFunctionName(service)}'.`);

        const serviceInfo = service[registrableMetadataKey] as IService;
        const parameters = (this.getDedependencies(serviceInfo.dependencies) || new Array<any>()) as Array<any>;
        parameters.push(serviceInfo.factory);

        if (ObjectExtensions.isNull(serviceInfo.factory))
            throw new Error("Missing service factory.");

        this.module.factory(serviceInfo.name, parameters);
        this.logger.debug(`registering ${serviceInfo.name}`);
    }

    registerLoggingService(service: Function): void
    {
        if (ObjectExtensions.isNull(service) ||
            ObjectExtensions.isNull(service[registrableMetadataKey]))
            throw new Error(`Problems registering the logging service '${FunctionExtensions.getFunctionName(service)}'.`);

        const serviceInfo = service[registrableMetadataKey] as IService;
        const parameters = (this.getDedependencies(serviceInfo.dependencies) || new Array<any>()) as Array<any>;
        parameters.push(serviceInfo.factory);

        this.module.factory(serviceInfo.name, parameters);
        this.logger = serviceInfo.factory();

        this.logger.debug(`registering ${serviceInfo.name}`);
    }

    registerInterceptors(interceptors: Function[]): void
    {
        ArrayExtensions.forEach(interceptors, x => this.registerInterceptor(x));
    }

    registerInterceptor(interceptor: Function): void
    {
        if (ObjectExtensions.isNull(interceptor) ||
            ObjectExtensions.isNull(interceptor[registrableMetadataKey]))
            throw new Error(`Problems registering the interceptor '${FunctionExtensions.getFunctionName(interceptor)}'.`);

        const interceptorInfo = interceptor[registrableMetadataKey] as IInterceptor;

        if (this.httpProvider == null)
            this.interceptorsQueue.push(interceptor);
        else
        {
            const parameters = (this.getDedependencies(interceptorInfo.dependencies) || new Array<any>()) as Array<any>;
            parameters.push(interceptorInfo.factory);
            this.httpProvider.interceptors.push(parameters);
        }

        this.logger.debug(`registering ${interceptorInfo.name}`);
    }

    registerFilters(filters: Function[]): void
    {
        ArrayExtensions.forEach(filters, x => this.registerFilter(x));
    }

    registerFilter(filter: Function): void
    {
        if (ObjectExtensions.isNull(filter) ||
            ObjectExtensions.isNull(filter[registrableMetadataKey]))
            throw new Error(`Problems registering the filter '${FunctionExtensions.getFunctionName(filter)}'.`);

        const filterInfo = filter[registrableMetadataKey] as IFilter;
        const parameters = (this.getDedependencies(filterInfo.dependencies) || new Array<any>()) as Array<any>;
        parameters.push(filterInfo.factory);

        this.module.filter(filterInfo.name, parameters);
        this.logger.debug(`registering ${filterInfo.name}`);
    }

    registerDirectives(directives: Function[]): void
    {
        ArrayExtensions.forEach(directives, x => this.registerDirective(x));
    }

    registerDirective(directive: Function): void
    {
        if (ObjectExtensions.isNull(directive) ||
            ObjectExtensions.isNull(directive[registrableMetadataKey]))
            throw new Error(`Problems registering the directive '${FunctionExtensions.getFunctionName(directive)}'.`);

        const directiveInfo = directive[registrableMetadataKey] as IDirective;
        const parameters = (this.getDedependencies(directiveInfo.dependencies) || new Array<any>()) as Array<any>;
        parameters.push(directiveInfo.factory);

        this.module.directive(directiveInfo.name, parameters);
        this.logger.debug(`registering ${directiveInfo.name}`);
    }

    private registerStates(stateProvider: StateProvider): void
    {
        this.stateProvider = stateProvider;

        if (!ObjectExtensions.isNull(this.controllersQueue))
        {
            for (let i = 0; i < this.controllersQueue.length; i++)
            {
                this.registerControllerState(this.controllersQueue[i]);
            }

            this.controllersQueue = null;
        }
    }

    private registerInterceptorsInternally(httpProvider: IHttpProvider): void
    {
        this.httpProvider = httpProvider;

        if (!ObjectExtensions.isNull(this.interceptorsQueue))
        {
            for (let i = 0; i < this.interceptorsQueue.length; i++)
            {
                this.registerInterceptor(this.interceptorsQueue[i]);
            }

            this.interceptorsQueue = null;
        }
    }

    private registerControllerState(controller: Function): void
    {
        var controllerInfo = controller[registrableMetadataKey] as IController;

        if (controllerInfo.stateName == null)
            return;

        this.stateProvider.state(controllerInfo.stateName,
            {
                controllerAs: controllerInfo.controllerAs,
                url: controllerInfo.stateUrl,
                templateUrl: controllerInfo.templateUrl,
                template: controllerInfo.template,
                resolve: controllerInfo.resolve
            } as Ng1StateDeclaration);
    }

    private getDedependencies(dependencies: Array<string | Function>): string[]
    {
        if (ObjectExtensions.isNull(dependencies))
            return null;

        return ArrayExtensions.select(dependencies, x =>
            (ObjectExtensions.getTypeName(x) === "String")
                ? x as string
                : getRegistrableName(x as Function) || FunctionExtensions.getFunctionName(x as Function));
    }

    protected configureRoutes(stateProvider: StateProvider, urlRouterProvider: UrlRouterProvider, httpProvider: IHttpProvider, locationProvider: ILocationProvider): void
    {
        /* override if needed */
    }

    protected authorizeRoute(rootScope: IScope, state: StateService, injector: auto.IInjectorService): void
    {
        /* override if needed */
    }

    protected configureTranslator(translateProvider: translate.ITranslateProvider): void
    {
        /* override if needed */
    }

    protected getModuleDependencies(): Array<string>
    {
        throw new Error("Please override getModuleDependencies method and provide other required modules or an empty array.");
    }

    protected register(): void
    {
        // override this method to change the base logging service.
    }
}