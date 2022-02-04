/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { TestPromiseService, TestLoggingService } from "../mocks/mock.service.spec";
import { IRootScopeService, IControllerService, auto, mock } from "angular";
import { FrameworkModule } from "../framework.module";
import { AngularServices } from "../services/angular.service";
import { AlertService } from "../services/alert.service";
import { LoggingService } from "../services/logging.service";
import { MockController } from "../mocks/mock.controller.spec";
import { InjectorService } from "../services/injector.service";
import { registrableMetadataKey, getRegistrableName } from "../decorators/registrable";

describe("MockController", () => {
    var injector: InjectorService;
    var rootScopeService: IRootScopeService;
    var controllerService: IControllerService;
    var alertService: AlertService;
    var testService: TestPromiseService;
    var logger = new TestLoggingService();

    beforeEach(() => {
        // create a new framework module with all the configuration.
        mock.module(FrameworkModule.instance.getModuleName());

        // inject a dummy logging service to prevent undesired logging.
        mock.module($provide => {
            $provide.value(getRegistrableName(LoggingService), logger);

            var testPromiseService = TestPromiseService[registrableMetadataKey].dependencies.slice(0);
            testPromiseService.push(TestPromiseService[registrableMetadataKey].factory);
            $provide.factory("TestPromiseService", testPromiseService);
        });
    });

    // prepare base services and classes.
    beforeEach(inject(($injector: auto.IInjectorService) => {
        injector = InjectorService.factory($injector);
        rootScopeService = injector.get<IRootScopeService>(AngularServices.rootScope);
        controllerService = injector.get<IControllerService>(AngularServices.controller);
        alertService = injector.get(AlertService);
        testService = injector.get(TestPromiseService);
    }));

    function getController(): MockController {
        return controllerService(MockController, { scope: rootScopeService.$new(false, rootScopeService), injector: injector, testService: testService });
    }

    describe("controller construction", () => {
        it("shuld instantiate test controller", () => {
            var controller = getController();
            expect(controller).not.toBeNull();
            expect(controller.numberResult).toBe(0);
            expect(controller.booleanResult).toBe(false);
            expect(controller.stringResult).toBe("");
            expect(controller.dateResult).toBe(null);
            expect(controller.objectResult).toBe(null);
            expect(controller.arrayResult).toBe(null);
            expect(controller.rejectionReason).toBe("");
            expect(controller.loading).toBe(false);
        });
    });

    describe("base methods", () => {
        it("should have base services", () => {
            var controller = getController();

            expect(controller.getAlertService()).not.toBeNull();
            expect(controller.getStateService()).not.toBeNull();
            expect(controller.getMessageBus()).not.toBeNull();
            expect(controller.getTranslator()).not.toBeNull();
            expect(controller.getLogger()).not.toBeNull();
            expect(controller.getMessageBusTokens()).not.toBeNull();
        });

        /*it("should get services", () => expect(ObjectExtensions.getTypeName(getController().retrieveService<ITestPromiseService>("TestPromiseService"))).toBe("TestPromiseService"));*/
    });

    describe("promise methods", () => {
        it("should respond number promises", () => {
            var controller = getController();

            controller.testNumbers();
            rootScopeService.$apply();

            expect(controller.numberResult).toBe(testService.numberResult);
        });

        it("should respond boolean promises", () => {
            var controller = getController();

            controller.testBooleans();
            rootScopeService.$apply();

            expect(controller.booleanResult).toBe(testService.booleanResult);
        });

        it("should respond string promises", () => {
            var controller = getController();

            controller.testStrings();
            rootScopeService.$apply();

            expect(controller.stringResult).toBe(testService.stringResult);
        });

        it("should respond date promises", () => {
            var controller = getController();

            controller.testDates();
            rootScopeService.$apply();

            expect(controller.dateResult).toBe(testService.dateResult);
        });

        it("should respond object promises", () => {
            var controller = getController();

            controller.testObjects();
            rootScopeService.$apply();

            expect(ObjectExtensions.isEqualTo(controller.objectResult, testService.objectResult)).toBe(true);
        });

        it("should respond array promises", () => {
            var controller = getController();

            controller.testArrays();
            rootScopeService.$apply();

            expect(ObjectExtensions.isEqualTo(controller.arrayResult, testService.arrayResult)).toBe(true);
        });

        it("should reject promises", () => {
            var controller = getController();

            controller.testRejection();
            rootScopeService.$apply();

            expect(controller.rejectionReason).toBe(testService.rejectionReason);
        });
    });
});
