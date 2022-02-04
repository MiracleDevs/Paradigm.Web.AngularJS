/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ComponentBase } from "../components/base.component";
import { Component, TextBinding, InputBinding, OutputBinding, TwoWayBinding, Require } from "../decorators/component";
import { AngularServices } from "../services/angular.service";
import { IScope } from "angular";
import { InjectorService } from "../services/injector.service";

@Component({
    template: "<span>{{name}}</span>",
    dependencies: [AngularServices.scope, InjectorService],
})
export class MockComponent extends ComponentBase {
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

    constructor(scope: IScope, injector: InjectorService) {
        super(scope, injector);
    }
}
