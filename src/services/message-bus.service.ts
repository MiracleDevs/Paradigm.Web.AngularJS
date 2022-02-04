/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Service } from "../decorators/service";
import { ServiceBase } from "./base.service";
import { Dictionary, ArrayList, ObjectExtensions, Guid } from "@miracledevs/paradigm-ui-web-shared";
import { messageTypeKey } from "../decorators/message";

@Service({ name: "$pd-messageBus" })
export class MessageBus extends ServiceBase {
    private handlers: Dictionary<string, ArrayList<MessageBusHandler>>;

    constructor() {
        super();
        this.handlers = new Dictionary<string, ArrayList<MessageBusHandler>>();
    }

    count(): number {
        return this.handlers.count();
    }

    isRegistered<T>(messageType: new (...args: any[]) => T): boolean {
        const type = messageType[messageTypeKey];
        return this.handlers.containsKey(type);
    }

    handlerCount<T>(messageType: new (...args: any[]) => T): number {
        const type = messageType[messageTypeKey];

        if (!this.handlers.containsKey(type)) return 0;

        return this.handlers.get(type).count();
    }

    register<T>(messageType: { new (...args: any[]): T }, handler: (x: T) => void): RegistrationToken {
        const type = messageType[messageTypeKey];

        if (!this.handlers.containsKey(type)) this.handlers.add(type, new ArrayList<MessageBusHandler>());

        const messageBusHandler = new MessageBusHandler(messageType, handler);
        this.handlers.get(type).add(messageBusHandler);

        return messageBusHandler.token;
    }

    unregister(token: RegistrationToken): void {
        const type = token.type[messageTypeKey];

        if (!this.handlers.containsKey(type)) return;

        const handler = this.handlers.get(type);
        handler.removeAll(x => x.token.guid === token.guid);

        if (!handler.any()) this.handlers.remove(type);
    }

    send<T>(message: T, token?: RegistrationToken): boolean {
        if (ObjectExtensions.isNull(message)) throw new Error("Can not send a null message.");

        if (ObjectExtensions.isNull(message.constructor)) throw new Error("Message does not have a constructor, and the system can not infer the type.");

        const type = message.constructor[messageTypeKey];

        if (!this.handlers.containsKey(type)) return false;

        const handlers = this.handlers
            .get(type)
            .where(x => token == null || token.guid === x.token.guid)
            .select(x => x.handler);

        let accepted = false;

        for (let i = handlers.count() - 1; i >= 0; i--) {
            const handler = handlers.get(i);

            if (handler == null) continue;

            accepted = true;
            handler(message);
        }

        return accepted;
    }

    static factory(): MessageBus {
        return new MessageBus();
    }
}

export class MessageBusHandler {
    private innerToken: RegistrationToken;

    private innerHandler: Function;

    get token(): RegistrationToken {
        return this.innerToken;
    }

    get handler(): Function {
        return this.innerHandler;
    }

    constructor(type: Function, handler: Function) {
        this.innerHandler = handler;
        this.innerToken = new RegistrationToken(type);
    }
}

export class RegistrationToken {
    private innerType: Function;

    private innerGuid: Guid;

    get type(): Function {
        return this.innerType;
    }

    get guid(): Guid {
        return this.innerGuid;
    }

    constructor(type: Function) {
        this.innerType = type;
        this.innerGuid = Guid.new();
    }
}
