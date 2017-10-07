import { Message } from "../decorators/message";

@Message("MockMessage")
export class MockMessage {
    constructor(public readonly someValue: string){

    }
}