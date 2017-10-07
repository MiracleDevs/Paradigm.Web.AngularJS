/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IScope, auto } from "angular";
import { ControllerBase } from "../base.controller";
import { ModalInstance } from "../../services/modal.service";
import { InjectorService } from "../../services/injector.service";

export abstract class DialogControllerBase extends ControllerBase
{
    protected modalInstance: ModalInstance;

    protected constructor(scope: IScope, modalInstance: ModalInstance, injector: InjectorService)
    {
        super(scope, injector);

        this.modalInstance = modalInstance;
    }

    cancel()
    {
        this.modalInstance.close();
    }

    protected close(result: any = null)
    {
        this.modalInstance.resolve(result);
    }
}