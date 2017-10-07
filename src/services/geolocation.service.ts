/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Service } from "../decorators/service";
import { ServiceBase } from "./base.service";
import { ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";

@Service({ name: "$pd-geolocationService"})
export class GeolocationService extends ServiceBase
{
    getPosition(callback: (info: IGeolocationInformation) => void, onError?: (error: PositionError) => void, options?: IPositionOptions): void
    {
        if (!this.isAvailable())
            return;

        this.getGeolocator().getCurrentPosition(callback, onError, options);
    }

    watchPosition(callback: (info: IGeolocationInformation) => void, onError?: (error: PositionError) => void, options?: IPositionOptions): number
    {
        if (!this.isAvailable())
            return -1;

        return this.getGeolocator().watchPosition(callback, onError, options);
    }

    clearWatch(watchId: number): void
    {
        if (!this.isAvailable())
            return;

        this.getGeolocator().clearWatch(watchId);
    }

    isAvailable(): boolean
    {
        return !ObjectExtensions.isNull(navigator.geolocation);
    }

    private getGeolocator(): Geolocation
    {
        return navigator.geolocation;
    }

    static factory(): GeolocationService
    {
        return new GeolocationService();
    }
}

export interface ICoordinates
{
    latitude: number;	        // the latitude as a decimal number (always returned)
    longitude: number;	        // the longitude as a decimal number (always returned)
    accuracy: number;	        // the accuracy of position (always returned)
    altitude: number;	        // the altitude in meters above the mean sea level (returned if available)
    altitudeAccuracy: number;	// the altitude accuracy of position (returned if available)
    heading: number;	        // the heading as degrees clockwise from North (returned if available)
    speed: number;	            // the speed in meters per second (returned if available)
}

export interface IGeolocationInformation
{
    coords: ICoordinates;

    timestamp: number;
}

export interface IPositionOptions
{
    enableHighAccuracy?: boolean;

    timeout?: number;

    maximumAge?: number;
}