/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */
import { ServiceBase } from "./base.service";
import { Service } from "../decorators/service";
import { AngularServices } from "./angular.service";
import { ISCEService, IQService, IDocumentService, IDeferred, IPromise } from "angular";
import { Dictionary } from "@miracledevs/paradigm-ui-web-shared";
import * as angular from "angular";

@Service({
    name: "$pd-asyncResourceService",
    dependencies: [AngularServices.sce, AngularServices.q, AngularServices.document]
})
export class AsyncResourceService extends ServiceBase
{
    private readonly deferredRequests: Dictionary<string, IDeferred<void>>;

    constructor(private sce: ISCEService, private q: IQService, private document: IDocumentService)
    {
        super();
        this.deferredRequests = new Dictionary<string, IDeferred<void>>();
    }

    loadScript(url: string): IPromise<void>
    {
        return this.loadResource("script", url);
    }

    loadImage(url: string): IPromise<void>
    {
        return this.loadResource("img", url);
    }

    loadVieo(url: string): IPromise<void>
    {
        return this.loadResource("video", url);
    }

    private loadResource(type: string, url: string): IPromise<void>
    {
        if (this.deferredRequests.containsKey(url))
            return this.deferredRequests.get(url).promise;

        const defer = this.q.defer<void>();
        this.deferredRequests.add(url, defer);

        this.sce.trustAsResourceUrl(url);
        const element = angular.element(`<${type}></${type}>`);
        this.document.find("body").append(element);

        element.on("load", () => defer.resolve());
        element.attr("id", "async script");
        element[0]["src"] = url;

        return defer.promise;
    }

    static factory(sce: ISCEService, q: IQService, document: IDocumentService): AsyncResourceService
    {
        return new AsyncResourceService(sce, q, document);
    }
}