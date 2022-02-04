/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { IFilterService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import { AngularServices } from "../services/angular.service";

@Directive({
    name: "dateTimePicker",
    require: "ngModel",
    dependencies: [AngularServices.filter],
})
export class DateTimePickerDirective extends DirectiveBase {
    constructor(private filter: IFilterService) {
        super();
    }

    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        var options = {} as IDateTimePickerParameters;

        //////////////////////////////////////////////////////////////////
        // own properties
        //////////////////////////////////////////////////////////////////
        this.tryGet(options, instanceAttributes, "format");
        this.tryGet(options, instanceAttributes, "dayViewHeaderFormat");
        this.tryGetBoolean(options, instanceAttributes, "extraFormats");
        this.tryGetNumber(options, instanceAttributes, "stepping");
        this.tryGetDate(options, instanceAttributes, "minDate");
        this.tryGetDate(options, instanceAttributes, "maxDate");
        this.tryGetBoolean(options, instanceAttributes, "useCurrent");
        this.tryGetBoolean(options, instanceAttributes, "collapse");
        this.tryGet(options, instanceAttributes, "locale");
        this.tryGet(options, instanceAttributes, "viewMode");
        this.tryGetDate(options, instanceAttributes, "defaultDate");
        this.tryGetBoolean(options, instanceAttributes, "disabledDates");
        this.tryGetBoolean(options, instanceAttributes, "enabledDates");
        this.tryGetBoolean(options, instanceAttributes, "disabledHours");
        this.tryGetBoolean(options, instanceAttributes, "disabledTimeIntervals");
        this.tryGetBoolean(options, instanceAttributes, "useStrict");
        this.tryGetBoolean(options, instanceAttributes, "sideBySide");
        this.tryGetBoolean(options, instanceAttributes, "calendarWeeks");
        this.tryGet(options, instanceAttributes, "toolbarPlacement");
        this.tryGetBoolean(options, instanceAttributes, "showTodayButton");
        this.tryGetBoolean(options, instanceAttributes, "showClear");
        this.tryGetBoolean(options, instanceAttributes, "showClose");
        this.tryGetBoolean(options, instanceAttributes, "keepOpen");
        this.tryGetBoolean(options, instanceAttributes, "allowInputToggle");
        this.tryGetBoolean(options, instanceAttributes, "focusOnShow");

        if (!ObjectExtensions.isNull(instanceAttributes["maxDateToday"])) options.maxDate = new Date();

        instanceElement["datetimepicker"](options);

        instanceElement.on("dp.change", e => {
            if (ObjectExtensions.isNull(options.format) || options.format === "L")
                controller.$setViewValue(!ObjectExtensions.isNull(e["date"]) ? this.filter("date")(e["date"]._d, "MM/dd/yyyy") : null);

            if (!ObjectExtensions.isNull(options.format) && options.format === "LT") controller.$setViewValue(!ObjectExtensions.isNull(e["date"]) ? this.filter("date")(e["date"]._d, "hh:mm") : null);
        });

        instanceElement.on("dp.show", () => {
            if (!ObjectExtensions.isNull(options.viewMode)) {
                instanceElement.data("DateTimePicker").viewMode(options.viewMode);
            }
        });
    }

    static factory(filter: IFilterService): DateTimePickerDirective {
        return new DateTimePickerDirective(filter);
    }
}

interface IDateTimePickerIcons {
    time?: string;
    date?: string;
    up?: string;
    down?: string;
    previous?: string;
    next?: string;
    today?: string;
    clear?: string;
    close?: string;
}

interface IDateTimePickerPositioning {
    horizontal?: string;
    vertical?: string;
}

interface IDateTimePickerParameters {
    format?: string;
    dayViewHeaderFormat?: string;
    extraFormats?: boolean;
    stepping?: number;
    minDate?: Date | boolean;
    maxDate?: Date | boolean;
    useCurrent?: boolean;
    collapse?: boolean;
    locale?: string;
    defaultDate?: Date;
    disabledDates?: boolean;
    enabledDates?: boolean;
    icons?: IDateTimePickerIcons;
    useStrict?: boolean;
    sideBySide?: boolean;
    daysOfWeekDisabled?: Array<number>;
    calendarWeeks?: boolean;
    viewMode?: "decades" | "years" | "months" | "days";
    toolbarPlacement?: string;
    showTodayButton?: boolean;
    showClear?: boolean;
    widgetPositioning?: IDateTimePickerPositioning;
    widgetParent?: any;
    keepOpen?: boolean;
    focusOnShow?: boolean;
}
