/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Filter } from "../decorators/filter";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Filter({ name: "pd-uppercase" })
export class UppercaseFilter {
    static factory(): (value: string) => string {
        return value => (ObjectExtensions.isNull(value) ? null : value.toUpperCase());
    }
}
