/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { auto, mock } from "angular";
import { AlertService, AlertType } from "./alert.service";
import { FrameworkModule } from "../framework.module";
import { FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { LoggingService } from "./logging.service";
import { InjectorService } from "./injector.service";
import { registrableMetadataKey, getRegistrableName } from "../decorators/registrable";
import { TestLoggingService } from "../mocks/mock.service.spec";

describe("AlertService", () =>
{
    var injector: InjectorService;
    var alertService: AlertService;
    var logger: TestLoggingService;

    beforeEach(() =>
    {
        // create a new framework module with all the configuration.
        mock.module(FrameworkModule.instance.getModuleName());

        // inject a dummy logging service to prevent undesired logging.
        mock.module($provide =>
        {
            logger = new TestLoggingService();
            $provide.value(getRegistrableName(LoggingService), logger);
        });
    });

    // prepare base services and classes.
    beforeEach(inject(($injector: auto.IInjectorService) =>
    {
        injector = InjectorService.factory($injector);
        alertService = injector.get(AlertService);
    }));

    describe("creating the service", () =>
    {
        it("should initialize correctly", () =>
        {
            expect(alertService).toBeDefined();
        });

        it("alert collection shouldn't be null", () =>
        {
            expect(alertService.getAlerts()).not.toBeNull();
            expect(alertService.getAlerts().getInnerArray()).not.toBeNull();
        });

        it("alert collection should be empty", () =>
        {
            expect(alertService.getAlerts().count()).toBe(0);
        });
    });

    describe("working with messages", () =>
    {
        it("should add a message", () =>
        {
            alertService.addMessage("testing message");
            expect(alertService.getAlerts().count()).toBe(1);
            expect(logger.getLogWritten(AlertService.getLogType(AlertType.Message))).toBe(1);
        });

        it("should remove a message by index", () =>
        {
            alertService.addMessage("testing message");
            alertService.remove(0);
            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should remove a message by alert", () =>
        {
            alertService.addMessage("testing message");
            var alert = alertService.get(0);
            alertService.remove(alert);
            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should remove several messages", () =>
        {
            alertService.addMessage("testing message 1");
            alertService.addMessage("testing message 2");
            alertService.addMessage("testing message 3");
            alertService.addMessage("testing message 4");

            var alert1 = alertService.get(0);
            var alert2 = alertService.get(1);
            var alert3 = alertService.get(2);
            var alert4 = alertService.get(3);

            alertService.remove(alert1);
            alertService.remove(alert2);
            alertService.remove(alert3);
            alertService.remove(alert4);

            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should get a message", () =>
        {
            alertService.addMessage("testing message");
            var alert = alertService.get(0);
            alertService.remove(0);
            expect(alert.type).toBe(AlertType.Message);
            expect(alert.message).toBe("testing message");
        });

        it("should clear all messages", () =>
        {
            alertService.clear();
            expect(alertService.getAlerts().count()).toBe(0);
        });
    });

    describe("working with warnings", () =>
    {
        it("should add a warning", () =>
        {
            alertService.addWarning("testing warning");
            expect(alertService.getAlerts().count()).toBe(1);
            expect(logger.getLogWritten(AlertService.getLogType(AlertType.Warning))).toBe(1);
        });

        it("should remove a warning by index", () =>
        {
            alertService.addWarning("testing warning");
            alertService.remove(0);
            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should remove a warning by alert", () =>
        {
            alertService.addWarning("testing warning");
            var alert = alertService.get(0);
            alertService.remove(alert);
            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should get a warning", () =>
        {
            alertService.addWarning("testing warning");
            var alert = alertService.get(0);
            alertService.remove(0);
            expect(alert.type).toBe(AlertType.Warning);
            expect(alert.message).toBe("testing warning");
        });

        it("should clear all warnings", () =>
        {
            alertService.clear();
            expect(alertService.getAlerts().count()).toBe(0);
        });
    });

    describe("working with errors", () =>
    {
        it("should add an error", () =>
        {
            alertService.addError("testing error");
            expect(alertService.getAlerts().count()).toBe(1);
            expect(logger.getLogWritten(AlertService.getLogType(AlertType.Error))).toBe(1);
        });

        it("should remove a error by index", () =>
        {
            alertService.addError("testing error");
            alertService.remove(0);
            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should remove a error by alert", () =>
        {
            alertService.addError("testing error");
            var alert = alertService.get(0);
            alertService.remove(alert);
            expect(alertService.getAlerts().count()).toBe(0);
        });

        it("should get an error", () =>
        {
            alertService.addError("testing error");
            var alert = alertService.get(0);
            alertService.remove(0);
            expect(alert.type).toBe(AlertType.Error);
            expect(alert.message).toBe("testing error");
        });

        it("should clear all errors", () =>
        {
            alertService.clear();
            expect(alertService.getAlerts().count()).toBe(0);
        });
    });
});