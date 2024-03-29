﻿/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

export class ModelBase {
    private original: ModelBase;

    startTracking(): void {
        this.original = ObjectExtensions.clone(this, ["original"]);
    }

    stopTracking(): void {
        this.original = null;
    }

    isDirty(): boolean {
        return !ObjectExtensions.isEqualTo(this, this.original, ["original"]);
    }

    isTracking(): boolean {
        return this.original != null;
    }
}
