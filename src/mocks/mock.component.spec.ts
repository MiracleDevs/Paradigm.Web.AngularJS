import { ComponentBase } from "../components/base.component";
import { Component, TextBinding, InputBinding, OutputBinding, TwoWayBinding, Require } from "../decorators/component";
import { AngularServices } from "../services/angular.service";
import { IScope, auto } from "angular";
import { InjectorService } from "../services/injector.service";

@Component({
    template: '<span>{{name}}</span>',
    dependencies: [AngularServices.scope, InjectorService ]
})
export class MockComponent extends ComponentBase
{
    @TextBinding
    name: string;

    @InputBinding
    person: object;

    @OutputBinding
    onCreated: Function;

    @TwoWayBinding
    parent: object;

    @Require(MockComponent, true)
    firstRequire: MockComponent;

    @Require("ngModel")
    secondRequire: MockComponent;

    constructor(scope: IScope, injector: InjectorService)
    {
        super(scope, injector);
    }
}