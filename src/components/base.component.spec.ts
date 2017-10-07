/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { ObjectExtensions, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { IRootScopeService, IComponentControllerService, auto, mock } from "angular";
import { FrameworkModule } from "../framework.module";
import { AngularServices } from "../services/angular.service";
import { MockComponent } from "../mocks/mock.component.spec";
import { IComponent } from "../decorators/component";
import { LoggingService } from "../services/logging.service";
import { InjectorService } from "../services/injector.service";
import { AlertService } from "../services/alert.service";
import { registrableMetadataKey, getRegistrableName } from "../decorators/registrable";

describe("MockComponent", () =>
{
    var rootScopeService: IRootScopeService;
    var injector: InjectorService;
    var logger = new LoggingService();

    beforeEach(() =>
    {
        // create a new framework module with all the configuration.
        mock.module(FrameworkModule.instance.getModuleName());

        // inject a dummy logging service to prevent undesired logging.
        mock.module($provide =>
        {
            $provide.value(getRegistrableName(LoggingService), logger);
        });
    });

    // prepare base services and classes.
    beforeEach(inject(($injector: auto.IInjectorService) =>
    {
        injector = InjectorService.factory($injector);
        rootScopeService = injector.get<IRootScopeService>(AngularServices.rootScope);
    }));

    function getComponent(): MockComponent
    {
        return new MockComponent(rootScopeService.$new(false, rootScopeService), injector);
    }

    describe("structure", () =>
    {
        it("shuld have bindings", () =>
        {
            expect(MockComponent).not.toBeNull();
            var parameters = MockComponent[registrableMetadataKey] as IComponent;

            expect(parameters).not.toBeNull();
            expect(parameters.bindings).not.toBeNull();
            expect(parameters.bindings["name"]).toBe("@");
            expect(parameters.bindings["person"]).toBe("<");
            expect(parameters.bindings["onCreated"]).toBe("&");
            expect(parameters.bindings["parent"]).toBe("=");
        });

        it("shuld have requirements", () =>
        {
            expect(MockComponent).not.toBeNull();
            var parameters = MockComponent[registrableMetadataKey] as IComponent;

            expect(parameters).not.toBeNull();
            expect(parameters.require).not.toBeNull();

            expect(parameters.require["firstRequire"]).toBe("^MockComponent");
            expect(parameters.require["secondRequire"]).toBe("ngModel");
        });
    });

    describe("construction", () =>
    {
        it("shuld instantiate test Component", () =>
        {
            var component = getComponent();
            expect(component).not.toBeNull();
        });
    });
});