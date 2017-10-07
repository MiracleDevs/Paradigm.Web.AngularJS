/*!
 * Paradigm UI Web
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { ObjectExtensions, LocalStorage } from "@miracledevs/paradigm-ui-web-shared";

export class ObjectSession
{
    static save<T>(name: string, data: T): void
    {
        LocalStorage.set<String>(name, JSON.stringify(data));
    }

    static restore<T>(name: string): T
    {
        const content = LocalStorage.get<String>(String, name);

        if (ObjectExtensions.isNull(content))
            return null;

        return JSON.parse(content.valueOf()) as T;
    }

    static clear(name: string): void
    {
        LocalStorage.remove(name);
    }
}
