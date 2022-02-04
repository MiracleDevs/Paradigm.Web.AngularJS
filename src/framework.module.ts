/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { ModuleBase } from "./base.module";
import { AddClassDirective } from "./directives/add-class.directive";
import { AlertDirective } from "./directives/alert.directive";
import { BackgroundImageDirective } from "./directives/background-image.directive";
import { CommentAreaDirective } from "./directives/comment-area.directive";
import { ConvertToNumberDirective } from "./directives/convert-to-number.directive";
import { DateTimePickerDirective } from "./directives/date-time-picker.directive";
import { FileButtonDirective } from "./directives/file-button.directive";
import { FileDragAndDropDirective } from "./directives/file-drag-and-drop.directive";
import { FocusWhenDirective } from "./directives/focus-when.directive";
import { FormatAsNumberDirective } from "./directives/format-as-number.directive";
import { FullSelectDirective } from "./directives/full-select.directive";
import { HorizontalScrollerDirective } from "./directives/horizontal-scroller.directive";
import { KeyboardListenerDirective } from "./directives/keyboard-listener.directive";
import { MdUiSrefActiveDirective } from "./directives/md-ui-sref-active.directive";
import { OnKeyboardDirective } from "./directives/on-keyboard.directive";
import { PreventEventIfDirective } from "./directives/prevent-event-if.directive";
import { RemoveClassDirective } from "./directives/remove-class.directive";
import { ScrollToBottomDirective } from "./directives/scroll-to-bottom.directive";
import { ScrollToggleClassDirective } from "./directives/scroll-toggle-class.directive";
import { ScrollToTopDirective } from "./directives/scroll-to-top.directive";
import { SelectToggleClassDirective } from "./directives/select-toggle-class.directive";
import { ToggleClassDirective } from "./directives/toggle-class.directive";
import { ToggleClassOnClickDirective } from "./directives/toggle-class-on-click.directive";
import { TooltipDirective } from "./directives/tooltip.directive";
import { AlertService } from "./services/alert.service";
import { AsyncResourceService } from "./services/async-resource.service";
import { DateService } from "./services/date.service";
import { ExceptionService } from "./services/exception.service";
import { FileManagementService } from "./services/file-management.service";
import { GeolocationService } from "./services/geolocation.service";
import { KeyProcessorService } from "./services/key-processor.service";
import { MessageBus } from "./services/message-bus.service";
import { ModalService } from "./services/modal.service";
import { LoggingService } from "./services/logging.service";
import { UrlService } from "./services/url.service";
import { InjectorService } from "./services/injector.service";

export class FrameworkModule extends ModuleBase {
    private static internalInstance = new FrameworkModule();

    static get instance(): FrameworkModule {
        return FrameworkModule.internalInstance;
    }

    constructor() {
        if (FrameworkModule.internalInstance != null) throw new Error("The program does not allow more than one instance of the ModuleBase.");

        super();
        FrameworkModule.internalInstance = this;
        this.logger.debug("creating application");
    }

    getModuleName(): string {
        return "miracledevs-framework";
    }

    protected register(): void {
        this.registerLoggingService(LoggingService);

        this.registerServices([
            InjectorService,
            AlertService,
            AsyncResourceService,
            DateService,
            ExceptionService,
            FileManagementService,
            GeolocationService,
            KeyProcessorService,
            LoggingService,
            MessageBus,
            ModalService,
            UrlService,
        ]);

        this.registerDirectives([
            AddClassDirective,
            AlertDirective,
            BackgroundImageDirective,
            CommentAreaDirective,
            ConvertToNumberDirective,
            DateTimePickerDirective,
            FileButtonDirective,
            FileDragAndDropDirective,
            FocusWhenDirective,
            FormatAsNumberDirective,
            FullSelectDirective,
            HorizontalScrollerDirective,
            KeyboardListenerDirective,
            MdUiSrefActiveDirective,
            OnKeyboardDirective,
            PreventEventIfDirective,
            RemoveClassDirective,
            ScrollToBottomDirective,
            ScrollToggleClassDirective,
            ScrollToTopDirective,
            SelectToggleClassDirective,
            ToggleClassDirective,
            ToggleClassOnClickDirective,
            TooltipDirective,
        ]);
    }

    protected getModuleDependencies(): string[] {
        return ["ui.router", "ngAnimate", "pascalprecht.translate"];
    }
}
