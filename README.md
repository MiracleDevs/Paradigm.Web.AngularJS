[![Build Status](https://travis-ci.org/MiracleDevs/Paradigm.Web.AngularJS.svg?branch=master)](https://travis-ci.org/MiracleDevs/Paradigm.Web.AngularJS)
[![npm version](https://badge.fury.io/js/%40miracledevs%2Fparadigm-ui-web-angularjs.svg)](https://badge.fury.io/js/%40miracledevs%2Fparadigm-ui-web-angularjs)

# Paradigm.Web.AngularJS

This library adapts angularjs to typescript, using well defined objects, decorators and other typescript functionalities
to work in a ordered manner.

We first started this library to circumvent and later fix or resolve some of the gray areas in angular. Lots of programmers now days come from the web world, and they are already accustomed to dynamic languages and their advantages, but sometimes ignoring the benefits of using strong typing, and using classical inheritance vs prototypical inheritance. This library is oriented to people who want to have a more classical approach to application development, but still enjoy new technologies like angular, using tools like gulp to compile, run tests and do tons of other stuff.

Regarding angular and its idea of MVW, we are not happy with the W. "Whatever" is not a software philosophy, but a lack of design, a lack of minimal structure, which in the end produces lots of programmer not knowing what is the best place to develop some specific functionality. We aim to fix that while still giving power to the user.

## NPM

```
npm install --save @miracledevs/paradigm-ui-web-angularjs
```

## Change log

Version `1.4.1`:
- Added prettier and formatted source code.
- Removed unnecessary imports.

Version `1.4.0`:

-   Upgraded to angular 1.8.4.
-   Upgraded all npm packages when possible.
-   Removed gulp from solution.

Version `1.3.0`

-   Updated dependencies to the latest version.
-   Updated to angular 1.8.2
-   Updated gulp file.

Version `1.2.6`

-   Added state parameter configuration to the controller decorator.
    Now the parameters can be configured individually according to the
    ui-router specification [here](https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramdeclaration.html)

Version `1.2.5`

-   Updated npm dependencies.

Version `1.2.4`

-   Fixed bug on KeyboardListener directive disposing all event listeners when using several instances.
-   Fixed bug on DialogControllerBase not calling onInit.
-   Fixed bug on DialogControllerBase not calling onDestroy.
-   Fixed bug on ModalService not destroying the angular internal code.
-   Changed method `create` on directives to `onInit` to be similar to controllers and components.
-   Changed method `dispose` on directives to `onDestroy` to be similar to controllers and components.

Version `1.2.3`

-   Changed repository from gitlab to github.

Version `1.2.2`

-   Added name parameter to messages.

Version `1.2.1`

-   Changed base logging from trace to debug in base module.

Version `1.2.0`

-   Updated to the latest paradigm ui web shared library.
-   Removed old logging implementation for a new more mature one. This change can provoke errors on every class
    using the logger directly. The new version works with different levels of logging from trace to critical, allowing
    the user to set the minimum level of log they want to show. This can be changed at runtime at any time.
    Also the new logger allows message customization for each level.
-   Updated code and tests to the new logger.

Version `1.1.21`

-   Changed `toggle-class` directive to use the referenced element if element attribute is not provided.

Version `1.1.20`

-   Added a default value to controllerAs parameter for controllers, the default value is `"controller"`.
-   Added a default value to controllerAs parameter for components, the default value is `"controller"`.

Version `1.1.19`

-   Changed http service base to accept optional parameters.

Version `1.1.18`

-   Added decoration name to some classes.

Version `1.1.17`

-   Refactor modal service to send the scope instead of retrieving it from the element.

Version `1.1.16`

-   Refactor modal service to work directly with jquery element instead of a HTML Element.

Version `1.1.15`

-   Changed how the modal an transition scripts are included again due to webpack not including the imports.

Version `1.1.14`

-   Changed how the modal an transition scripts are included in the modal service.

Version `1.1.13`

-   Included bootstrap modal base logic used by the modal service as part of the solution.

Version `1.1.12`

-   Modified the modal service to use the template field if provided, and use the templateUrl if not.

Version `1.1.11`

-   Added a couple of new angular service dependencies.
-   Now directive restrict value will be 'A' by default.
-   Changed component and componentAs for controller and controllerAs.

Version `1.1.10`

-   Removed scope object from directive decorator. Only bindings can be passed for now.

Version `1.1.9`

-   Fixed another error with directives not setting the proper variables.

Version `1.1.8`

-   Fixed another error with directives not setting the proper variables.

Version `1.1.7`

-   Fixed an error with directives not setting the proper variables.

Version `1.1.6`

-   Included jquery to directive base to fix a webpack issue.

Version `1.1.5`

-   Included jquery to directive base to fix a webpack issue.

Version `1.1.4`

-   Fixed problem with base controller not instantiating the token list, and added new tests.
-   Removed references to index file.
-   Added missing classes to the index file.

Version `1.1.3`

-   Fixed problem with base controller services, and added new tests.

Version `1.1.2`

-   Removed console log from service decorator.
-   Changed names to framework service to prevent name collisions.
-   Integrated all the different registration decorators under one metadata key,
    and added help methods to extract the metadata.

Version `1.1.1`

-   Added missing parameter to index file.
-   Added missing optional type on ControllerBase.open method.

Version `1.1.0`

-   Added a new injector service to replace auto.IInjectorService which handles both old and new services.

    In order to resolve angular classes:
    `injector.get<IRootScopeService>(AngularServices.rootScope);`

    In order to resolve framework classes:
    `injector.get(MessageBus);`

-   Removed service interfaces. They are not required any more due to the new service approach. Service mocking
    can be done extending base classes instead due to typescript override functionality.
-   Migrated all the directives to the new decorator.
-   Migrated filters to the new approach.

Version `1.0.10`

-   Removed require functionality. In order to make it work, use the template field instead:
    `template: require("./my-component.template.html")` instead.
-   If the user does not provides the controller, or the factory (services, filters, interceptors, directives, etc) the
    framework will use the decorated instead. In the case of factories, if not factory is provided, it will
    look up for an static factory.

Version `1.0.9`

-   Now templateUrl in decorators will do a `require('url')` and the framework will internally use the
    template text instead of the url. This allow webpack and other bundling tools to cache template files.
-   Improved Directive decorators.

Version `1.0.8`

-   Changed directive class names to end with the word Directive.
-   Added tempalte field to controller decorator.

Version `1.0.7`

-   Added importHelpers flag to typescript.
-   Added tslib as dependency.

Version `1.0.6`

-   Fixed an error with typescript compiler adding invalid references to
    angular-mocks in d.ts files even when not referenced.

Version `1.0.5`

-   Fixed wrong parameter type in controller when registering messages.
-   Added missing exports to the index file.
-   Renamed Alert to AlertDirective to differenciate from Alert object.

Version `1.0.4`

-   Changed HttpServiceBase to mimic the http service in angular.

Version `1.0.3`

-   Changed dialog name conventions.
-   Added translate method to controllers and components.

Version `1.0.2`

-   Added Message decorator to ease the work with the message bus.
-   Improved message bus with new methods and improved parameters.
-   Added better support for message bus inside controllers and components.
-   Separated base controller in two classes to allow users to choose not to use our base clases.
-   Fixed licencing on files.
-   Added licencing file.

Version `1.0.1`

-   Added support for components.

Version `1.0.0`

-   Uploaded first version of the library.
