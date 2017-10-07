/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { auto, mock } from "angular";
import { TestLoggingService } from "../mocks/mock.service.spec";
import { FrameworkModule } from "../framework.module";
import { MockMessage } from "../mocks/mock.message.spec";
import { MessageBus, RegistrationToken } from "./message-bus.service";
import { FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { LoggingService } from "./logging.service";
import { InjectorService } from "./injector.service";
import { registrableMetadataKey, getRegistrableName } from "../decorators/registrable";

describe("MessageBus", () =>
{
    var injector: InjectorService;
    var messageBus: MessageBus;
    var logger = new TestLoggingService();

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
        messageBus = injector.get(MessageBus);
    }));

    describe("creating the service", () =>
    {
        it("should initialize correctly", () =>
        {
            expect(messageBus).toBeDefined();
        });

        it("message bus should be empty", () =>
        {
            expect(messageBus.count()).toBe(0);
        });
    });

    describe("working with messages", () =>
    {
        it("should register and unregister a message", () =>
        {
            var token: RegistrationToken;

            expect(() => token = messageBus.register(MockMessage, () => 0)).not.toThrow();
            expect(token).not.toBe(null);
            expect(messageBus.count()).toBe(1);
            expect(messageBus.isRegistered(MockMessage)).toBe(true);
            expect(messageBus.handlerCount(MockMessage)).toBe(1);

            expect(() => messageBus.unregister(token)).not.toThrow();
            expect(messageBus.count()).toBe(0);
            expect(messageBus.isRegistered(MockMessage)).toBe(false);
            expect(messageBus.handlerCount(MockMessage)).toBe(0);
        });

        it("should send a message", () =>
        {
            var response: string;
            var token = messageBus.register(MockMessage, x => response = x.someValue);

            expect(() => messageBus.send(new MockMessage("Test Value"))).not.toThrow();
            expect(response).toBe("Test Value");

            messageBus.unregister(token);
        });
    });
});