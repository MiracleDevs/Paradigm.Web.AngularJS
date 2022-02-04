/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Filter } from "../decorators/filter";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Filter({ name: "pd-trim" })
export class TrimFilter {
    private static trim(value: string, maxChars: number): string {
        if (ObjectExtensions.isNull(value)) return null;

        if (value.length < maxChars) return value;

        return value.substr(0, maxChars) + "...";
    }

    static factory(): (value: string, maxChars: number) => string {
        return TrimFilter.trim;
    }
}
