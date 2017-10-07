/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

 import { mock } from "angular";
 import { FrameworkModule } from "./framework.module";

describe("Framework Module", () =>
{
    it("Framework shoulnd't be null", () =>
    {
        expect(mock.module("miracledevs-framework")).not.toBeNull();
    });

    it("Singleton shouldn't be null", () =>
    {
        expect(FrameworkModule.instance).not.toBeNull();
    });

    it("FrameworkModule should have a name", () =>
    {
        expect(FrameworkModule.instance.getModuleName()).not.toBeNull();
    });
});