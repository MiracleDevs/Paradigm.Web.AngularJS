/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ServiceBase } from "./base.service";
import { Service } from "../decorators/service";
import { AngularServices } from "./angular.service";
import { AlertService } from "./alert.service";
import { LoggingService } from "./logging.service";

@Service({
    name: "$pd-exceptionService",
    dependencies: [AlertService, LoggingService]
})
export class ExceptionService extends ServiceBase
{
    constructor(private alertService: AlertService, private logger: LoggingService)
    {
        super();
    }

    processException(exception: Error, cause: string): void
    {
        this.alertService.addError(exception.message);
        this.logger.error(`Cause:${cause}`);
    }

    static factory(alertService: AlertService, logger: LoggingService): (exception: Error, cause: string) => void
    {
        return (exception: Error, cause: string) => new ExceptionService(alertService, logger).processException(exception, cause);
    }
}