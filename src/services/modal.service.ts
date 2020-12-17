/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Service } from "../decorators/service";
import { AngularServices } from "./angular.service";
import { ServiceBase } from "./base.service";
import { Dictionary, ObjectExtensions, Guid, FunctionExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { IController } from "../decorators/controller";
import * as angular from "angular";
import { registrableMetadataKey } from "../decorators/registrable";
import * as $ from "jquery";
import { transition } from "../scripts/bootstrap/transition";
import { modal } from "../scripts/bootstrap/modal";

transition($);
modal($);

@Service({
    name: "$pd-modalService",
    dependencies: [
        AngularServices.rootScope,
        AngularServices.q,
        AngularServices.http,
        AngularServices.templateCache,
        AngularServices.compile,
        AngularServices.controller
    ]
})
export class ModalService extends ServiceBase
{
    readonly modals: Dictionary<ModalInstance, JQuery>;

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $q: ng.IQService,
        private $http: ng.IHttpService,
        private $templateCache: ng.ITemplateCacheService,
        private $compile: ng.ICompileService,
        private $controller: ng.IControllerService
    )
    {
        super();
        this.modals = new Dictionary<ModalInstance, JQuery>();
    }

    open(dialog: IController | Function, parameters?: any, staticDialog: boolean = false, keyboard: boolean = true): ModalInstance
    {
        var dialogInfo = ObjectExtensions.getTypeName(dialog) === "Function" ? dialog[registrableMetadataKey] as IController : dialog as IController;

        if (dialogInfo == null)
            throw new Error("The modal controller registration information is missing.");

        if (ObjectExtensions.isNull(dialogInfo.template) &&
            ObjectExtensions.isNull(dialogInfo.templateUrl))
            throw new Error("Can not obtain a template for the modal. Use either template or templateUrl");

        var controllerAs = dialogInfo.controllerAs || "controller";

        var modalInstance = new ModalInstance(this, this.$q.defer());

        const template = !ObjectExtensions.isNull(dialogInfo.template) ? dialogInfo.template : this.$templateCache.get<string>(dialogInfo.templateUrl);

        // TODO: search for a better way to handle templateCache. $http probably have a handler to store the result on cache instead of storning the whole result object.
        if (template == null)
            this.$http.get<string>(dialogInfo.templateUrl, { cache: this.$templateCache }).then(result => this.openModal(dialogInfo, parameters, modalInstance, result.data, staticDialog, keyboard));
        else
            this.openModal(dialogInfo, parameters, modalInstance, ObjectExtensions.getTypeName(template).toLowerCase() === "string" ? template : template[1], staticDialog, keyboard);

        return modalInstance;
    }

    close(modalInstance: ModalInstance, reason?: string): void
    {
        const modal = this.modals.get(modalInstance);

        if (modal == null)
            return;

        if (ObjectExtensions.isNull(modal["modal"]))
            return;

        modal["modal"]("hide");
        modalInstance.deferred.reject(reason);
    }

    resolve<T>(modalInstance: ModalInstance, result: T): void
    {
        const modal = this.modals.get(modalInstance);

        if (modal == null)
            return;

        if (ObjectExtensions.isNull(modal["modal"]))
            return;

        modal["modal"]("hide");
        modalInstance.deferred.resolve(result);
    }

    private openModal(dialogInfo: IController, parameters: any, modalInstance: ModalInstance, template: string, staticDialog: boolean, keyboard: boolean): void
    {
        // create a new scope for the modal dialog.
        const scope = this.$rootScope.$new(true);
        const controllerParameters = {};

        controllerParameters[AngularServices.scope] = scope;
        controllerParameters[FunctionExtensions.getFunctionName(ModalInstance)] = modalInstance;
        controllerParameters[ModalParameters] = parameters;

        // instantiate the modal controller.
        const controller = this.$controller(dialogInfo.controller as any, controllerParameters) as angular.IController;

        // set the controller alias (by default will be controller).
        scope[dialogInfo.controllerAs] = controller;

        // create the modal DOM elements.
        const id = Guid.new().value;
        const modalBody = angular.element(`<div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-labelledby="login-title"></div>`);
        modalBody.html(template);

        // compile the modal DOM for angular to resolve bindings and elements.
        var code = $(this.$compile(modalBody)(scope));

        // add the modal DOM to the page body.
        $("body").append(code);

        // register the modal inside the service.
        this.modals.add(modalInstance, code);

        const dialogOptions = {};

        if (staticDialog)
            dialogOptions["backdrop"] = "static";

        if (keyboard)
            dialogOptions["keyboard"] = keyboard;

        // open the MaterializeCSS modal.
        code["modal"](dialogOptions);

        // set the z-index of modal and backdrop
        const zIndex = this.modals.getValues().count() * 1050;

        code.css("z-index", zIndex);
        $(code[0].nextElementSibling).css("z-index", zIndex - 10);

        code.on("hidden.bs.modal", () =>
        {
            modalInstance.deferred.reject("cancelled");
            this.removeModal(modalInstance, $(code), scope, controller);
        });

        controller.$onInit();
    }

    private removeModal(modalInstance: ModalInstance, modal: JQuery, scope: angular.IScope, controller: angular.IController): void
    {
        this.modals.remove(modalInstance);

        if (!ObjectExtensions.isNull(scope) && !ObjectExtensions.isNull(controller))
        {
            controller.$onDestroy();
            scope.$destroy();
        }

        if (!ObjectExtensions.isNull(modal))
        {
            modal.remove();
        }

        if (modalInstance.dispose != null)
        {
            modalInstance.dispose();
        }
    }

    static factory(
        $rootScope: ng.IRootScopeService,
        $q: ng.IQService,
        $http: ng.IHttpService,
        $templateCache: ng.ITemplateCacheService,
        $compile: ng.ICompileService,
        $controller: ng.IControllerService
    ): ModalService
    {
        return new ModalService($rootScope, $q, $http, $templateCache, $compile, $controller);
    }
}

export class ModalInstance
{
    private readonly modalService: ModalService;

    deferred: ng.IDeferred<any>;

    promise: ng.IPromise<any>;

    dispose: () => void;

    public constructor(modalService: ModalService, deferred: ng.IDeferred<any>)
    {
        this.modalService = modalService;
        this.deferred = deferred;
        this.promise = deferred.promise;
    }

    close(reason?: string): void
    {
        this.modalService.close(this, reason);
    }

    resolve(result: any): void
    {
        this.modalService.resolve(this, result);
    }
}

export const ModalParameters = "ModalParameters";