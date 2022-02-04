/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Service } from "../decorators/service";
import { AngularServices } from "./angular.service";
import { ServiceBase } from "./base.service";
import { ISCEService } from "angular";
import { StringExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Service({
    name: "$pd-urlService",
    dependencies: [AngularServices.sce],
})
export class UrlService extends ServiceBase {
    constructor(private sce: ISCEService) {
        super();
    }

    getParsedUrl(url: string): string {
        if (!StringExtensions.isString(url)) return url;

        if (StringExtensions.isNullOrEmpty(url)) return url;

        if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0) url = `http://${url}`;

        return this.sce.trustAsUrl(url);
    }

    static factory(sce: ISCEService): UrlService {
        return new UrlService(sce);
    }
}
