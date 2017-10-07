/*!
 * Paradigm UI Web 
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://gitlab.com/miracledevs-paradigm/ui-web-angularjs/blob/master/LICENSE)
 */

import { Filter } from "../decorators/filter";

@Filter({name: "pd-reverse"})
export class ReverseFilter
{
    static factory(): (items: any[]) => any[]
    {
        return items => items.slice().reverse();
    }
}