/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { Service } from "../decorators/service";
import { ServiceBase } from "./base.service";
import { ObjectExtensions, StringExtensions, DateExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Service({ name: "$pd-dateService" })
export class DateService extends ServiceBase
{
    getDate(value: Date | string): Date
    {
        if (value instanceof Date)
            return value as Date;

        let date = new Date();

        if (StringExtensions.isString(value))
            date = new Date(value as string);

        if (ObjectExtensions.isNull(date) || isNaN(date.getTime()))
        {
            date = DateExtensions.fromIso8601(value as string);
        }

        return date;
    }

    getDateRangeValue(value: Date | string): DateRangeValue
    {
        var oneSecond = 1000;
        var oneMinute = oneSecond * 60;
        var oneHour = oneMinute * 60;
        var oneDay = oneHour * 24;
        var oneYear = 12;

        var now = new Date(Date.now());
        var nowMiliseconds = now.getMilliseconds();
        var nowSeconds = now.getSeconds();
        var nowMinutes = now.getMinutes();
        var nowHours = now.getHours();
        var nowDays = now.getDate();
        var nowMonths = now.getMonth();
        var nowYears = now.getFullYear();

        // var oneSecondAgo = new Date(nowYears, nowMonths, nowDays, nowHours, nowMinutes, nowSeconds - 1, nowMiliseconds);
        var oneMinuteAgo = new Date(nowYears, nowMonths, nowDays, nowHours, nowMinutes - 1, nowSeconds, nowMiliseconds);
        var oneHourAgo = new Date(nowYears, nowMonths, nowDays, nowHours - 1, nowMinutes, nowSeconds, nowMiliseconds);
        var oneDayAgo = new Date(nowYears, nowMonths, nowDays - 1, nowHours, nowMinutes, nowSeconds, nowMiliseconds);
        var oneMonthAgo = new Date(nowYears, nowMonths - 1, nowDays, nowHours, nowMinutes, nowSeconds, nowMiliseconds);
        var oneYearAgo = new Date(nowYears - 1, nowMonths, nowDays, nowHours, nowMinutes, nowSeconds, nowMiliseconds);

        if (ObjectExtensions.isNull(value))
            return new DateRangeValue(0, DateRange.Unknown);

        var date = this.getDate(value);

        var rangeSeconds = Math.floor((now.valueOf() - date.valueOf()) / oneSecond);
        var rangeMinutes = Math.floor((now.valueOf() - date.valueOf()) / oneMinute);
        var rangeHours = Math.floor((now.valueOf() - date.valueOf()) / oneHour);
        var rangeDays = Math.floor((now.valueOf() - date.valueOf()) / oneDay);
        var rangeMonths = this.getMonthDifference(date, now);
        var rangeYears = Math.floor(rangeMonths / oneYear);

        if (date > oneMinuteAgo)
        {
            return new DateRangeValue(rangeSeconds, DateRange.Seconds);
        }
        else if (date > oneHourAgo && date <= oneMinuteAgo)
        {
            return new DateRangeValue(rangeMinutes, DateRange.Minutes);
        }
        if (date > oneDayAgo && date <= oneHourAgo)
        {
            return new DateRangeValue(rangeHours, DateRange.Hours);
        }
        else if (date > oneMonthAgo && date <= oneDayAgo)
        {
            return new DateRangeValue(rangeDays, DateRange.Days);
        }
        else if (date > oneYearAgo && date <= oneMonthAgo)
        {
            return new DateRangeValue(rangeMonths, DateRange.Months);
        }

        return new DateRangeValue(rangeYears, DateRange.Years);
    }

    private getMonthDifference(d1: Date, d2: Date): number
    {
        let months: number;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    static factory(): DateService
    {
        return new DateService();
    }
}

export enum DateRange
{
    Unknown = 0,
    Seconds = 1,
    Minutes = 2,
    Hours = 3,
    Days = 4,
    Months = 5,
    Years = 6
}

export enum MonthName
{
    "January" = 0,
    "February" = 1,
    "March" = 2,
    "April" = 3,
    "May" = 4,
    "June" = 5,
    "July" = 6,
    "August" = 7,
    "September" = 8,
    "October" = 9,
    "November" = 10,
    "December" = 11
}

export enum DayName
{
    "Sunday" = 0,
    "Monday" = 1,
    "Tuesday" = 2,
    "Wednesday" = 3,
    "Thursday" = 4,
    "Friday" = 5,
    "Saturday" = 6
}

export class DateRangeValue
{
    constructor(public value: number, public range: DateRange)
    {
    }
}