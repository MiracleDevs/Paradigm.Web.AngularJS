/*!
 * Paradigm Framework - AngularJS Wrapper
 * Copyright (c) 2017 Miracle Devs, Inc
 * Licensed under MIT (https://github.com/MiracleDevs/Paradigm.Web.Shared/blob/master/LICENSE)
 */

import { DirectiveBase } from "./base.directive";
import { Directive } from "../decorators/directive";
import { AngularServices } from "../services/angular.service";
import { IInterpolateService, IScope, IAttributes, IController, ITranscludeFunction } from "angular";
import { StringExtensions, ObjectExtensions } from "@miracledevs/paradigm-ui-web-shared";
import * as $ from "jquery";

@Directive({
    name: "horizontalScroller",
    dependencies: [AngularServices.interpolate],
})
export class HorizontalScrollerDirective extends DirectiveBase {
    constructor(private interpolate: IInterpolateService) {
        super();
    }

    protected onInit(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        const options = {} as IHorizontalScrollerParameters;

        options.element = instanceElement;
        this.tryGet(options, instanceAttributes, "container");
        this.tryGet(options, instanceAttributes, "content");
        this.tryGet(options, instanceAttributes, "leftArrow");
        this.tryGet(options, instanceAttributes, "rightArrow");
        this.tryGetNumber(options, instanceAttributes, "speed");
        this.tryGetNumber(options, instanceAttributes, "friction");
        this.tryGetNumber(options, instanceAttributes, "fps");
        this.tryGetNumber(options, instanceAttributes, "minVelocity");

        if (
            StringExtensions.isNullOrWhiteSpace(options.container) ||
            StringExtensions.isNullOrWhiteSpace(options.content) ||
            StringExtensions.isNullOrWhiteSpace(options.leftArrow) ||
            StringExtensions.isNullOrWhiteSpace(options.rightArrow)
        )
            return;

        instanceElement[0]["scrollerInstance"] = new HorizontalScrollerInstance(options);
        scope.$watch(
            () => instanceElement[0].innerHTML,
            () => instanceElement[0]["scrollerInstance"].enableScroll()
        );
    }

    protected onDestroy(scope: IScope, instanceElement: JQuery, instanceAttributes: IAttributes, controller: IController, transclude: ITranscludeFunction): void {
        instanceElement[0]["scrollerInstance"].dispose();
        super.onDestroy(scope, instanceElement, instanceAttributes, controller, transclude);
    }

    static factory(interpolate: IInterpolateService): HorizontalScrollerDirective {
        return new HorizontalScrollerDirective(interpolate);
    }
}

export interface IHorizontalScrollerParameters {
    element: JQuery;

    container: string;

    content: string;

    leftArrow: string;

    rightArrow: string;

    speed: number;

    friction: number;

    minVelocity: number;

    fps: number;
}

export class HorizontalScrollerInstance {
    element: JQuery;

    container: JQuery;

    content: JQuery;

    leftArrow: JQuery;

    rightArrow: JQuery;

    position: number;

    velocity: number;

    speed: number;

    friction: number;

    pressing: boolean;

    direction: number;

    millisecondsPerFrame: number;

    minVelocity: number;

    intervalId: number;

    lastTime: number;

    constructor(options: IHorizontalScrollerParameters) {
        this.element = $(options.element);
        this.container = this.element.find(options.container);
        this.content = this.element.find(options.content);
        this.leftArrow = this.element.find(options.leftArrow);
        this.rightArrow = this.element.find(options.rightArrow);

        this.position = 0;
        this.velocity = 0;
        this.speed = options.speed || 140;
        this.friction = options.friction || 0.95;
        this.millisecondsPerFrame = 1000 / (options.fps || 60);
        this.minVelocity = options.minVelocity || 10;

        this.enableScroll();
        $(window).on("resize", () => this.enableScroll());

        this.leftArrow.on("mousedown touchstart", () => this.moveLeft());
        this.leftArrow.on("mouseup mouseleave touchend touchcancel", () => (this.pressing = false));

        this.rightArrow.on("mousedown touchstart", () => this.moveRight());
        this.rightArrow.on("mouseup mouseleave touchend touchcancel", () => (this.pressing = false));
    }

    enableScroll(): void {
        const wContainer = this.container.width();
        const wContent = this.content.width();

        if (wContent < wContainer) {
            this.leftArrow.css("display", "none");
            this.rightArrow.css("display", "none");
            this.position = 0;
        } else {
            this.leftArrow.css("display", "inline-block");
            this.rightArrow.css("display", "inline-block");
        }

        this.checkConstraints();
        this.applyPosition();
    }

    private applyPosition(): void {
        const translate = `translate(${this.position}px, 0)`;
        const translate3D = `translate3d(${this.position}px, 0, 0)`;

        this.content.css({
            "-ms-transform": translate,
            "-moz-transform": translate3D,
            "-webkit-transform": translate3D,
            transform: translate3D,
        });
    }

    private checkConstraints(): void {
        const wContainer = this.container.width();
        const wContent = this.content.width();
        const minMovement = wContainer - wContent;

        if (wContent <= wContainer || this.position >= 0) this.position = 0;

        if (wContent >= wContainer && this.position <= minMovement) this.position = minMovement;
    }

    private killInterval(): void {
        if (ObjectExtensions.isNull(this.intervalId)) return;

        window.clearInterval(this.intervalId);
    }

    private getMilliseconds(): number {
        return new Date().getTime();
    }

    private moveLeft(): void {
        this.pressing = true;
        this.direction = 1;
        this.lastTime = this.getMilliseconds();

        this.killInterval();
        this.intervalId = window.setInterval(() => this.move(), this.millisecondsPerFrame);
    }

    private moveRight(): void {
        this.pressing = true;
        this.direction = -1;
        this.lastTime = this.getMilliseconds();

        this.killInterval();
        this.intervalId = window.setInterval(() => this.move(), this.millisecondsPerFrame);
    }

    private move(): void {
        const deltaTime = (this.getMilliseconds() - this.lastTime) / 1000;

        if (this.pressing) {
            this.velocity = this.speed;
        }

        this.velocity *= this.friction;
        this.position = this.position + this.direction * this.velocity * deltaTime;

        this.checkConstraints();
        this.applyPosition();

        if (this.velocity <= this.minVelocity) {
            this.killInterval();
        }

        this.lastTime = this.getMilliseconds();
    }

    dispose(): void {
        this.container.remove();
        this.content.remove();
        this.leftArrow.remove();
        this.rightArrow.remove();
    }
}
