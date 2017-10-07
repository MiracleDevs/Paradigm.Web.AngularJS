/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IScope, auto, IPromise } from "angular";
import { IComponent } from "../decorators/component";
import { StateService, StateObject } from "@uirouter/angularjs";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { ControllerBase } from "../controllers/base.controller";
import { InjectorService } from "../services/injector.service";

export abstract class ComponentBase extends ControllerBase implements angular.IComponentController
{
    protected constructor(protected scope: IScope, protected injector: InjectorService)
    {
        super(scope, injector);
    }
}
