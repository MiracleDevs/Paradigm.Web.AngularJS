/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
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
        // override this method.
    }

    protected doCheck(): void
    {
        // override this method.
    }

    protected onChanges(onChangesObj: IOnChangesObject): void
    {
        // override this method.
    }

    protected onDestroy(): void
    {
        // override this method.
    }

    protected postLink(): void
    {
        // override this method.
    }
}
