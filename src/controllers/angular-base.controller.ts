/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { IScope, IController as AngularController, IOnChangesObject } from "angular";

export abstract class AngularControllerBase implements AngularController
{
    protected constructor(protected scope: IScope)
    {
    }

    $onInit(): void
    {
        this.onInit();
    }

    $doCheck(): void
    {
        this.doCheck();
    }

    $onChanges(onChangesObj: IOnChangesObject): void
    {
        this.onChanges(onChangesObj);
    }

    $onDestroy(): void
    {
        this.onDestroy();
    }

    $postLink(): void
    {
        this.postLink();
    }

    protected onInit(): void
    {
    }

    protected doCheck(): void
    {
    }

    protected onChanges(onChangesObj: IOnChangesObject): void
    {
    }

    protected onDestroy(): void
    {
    }

    protected postLink(): void
    {
    } 
}
