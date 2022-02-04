/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { IScope } from "angular";
import { ControllerBase } from "../base.controller";
import { ModalInstance, ModalService } from "../../services/modal.service";
import { InjectorService } from "../../services/injector.service";

export abstract class DialogControllerBase extends ControllerBase {
    protected modalInstance: ModalInstance;

    protected modalService: ModalService;

    protected constructor(scope: IScope, modalInstance: ModalInstance, injector: InjectorService) {
        super(scope, injector);

        this.modalInstance = modalInstance;
        this.modalService = this.getService(ModalService);
    }

    isActiveDialog(): boolean {
        return this.modalService.modals.last().key === this.modalInstance;
    }

    cancel(): void {
        this.modalInstance.close();
    }

    protected close(result: any = null): void {
        this.modalInstance.resolve(result);
    }
}
