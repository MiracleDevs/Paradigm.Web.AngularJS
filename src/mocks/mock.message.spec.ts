/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Message } from "../decorators/message";

@Message("MockMessage")
export class MockMessage {
    constructor(public readonly someValue: string){

    }
}