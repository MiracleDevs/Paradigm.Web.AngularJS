/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { IPromise } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

export class ServiceBase
{
    protected call<T>(
        call: () => IPromise<T>,
        success?: (result: T) => void,
        loading?: (loading: boolean) => void,
        fail?: (reason: any) => void): void
    {
        if (!ObjectExtensions.isNull(loading))
            loading(true);

        call()
        .then(result =>
        {
            if (!ObjectExtensions.isNull(loading))
                loading(false);

            if (!ObjectExtensions.isNull(success))
            {
                success(result);
            }
        })
        .catch(error =>
        {
            if (!ObjectExtensions.isNull(loading))
                loading(false);

            if (!ObjectExtensions.isNull(fail))
                fail(error);
        });
    }
}