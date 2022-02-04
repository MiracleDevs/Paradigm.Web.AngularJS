module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "node_modules/angular/angular.js",
            "node_modules/angular-animate/angular-animate.js",
            "node_modules/@uirouter/angularjs/release/angular-ui-router.js",
            "node_modules/angular-translate/dist/angular-translate.js",
            "node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
            "node_modules/angular-translate/dist/angular-translate-loader-url/angular-translate-loader-url.js",
            "node_modules/angular-mocks/angular-mocks.js",
            "src/**/*.ts",
        ],
        preprocessors: {
            "src/**/*.ts": ["karma-typescript"],
        },
        karmaTypescriptConfig: {
            compilerOptions: {
                noImplicitAny: false,
                target: "ES5",
                moduleResolution: "node",
                module: "commonjs",
                sourceMap: true,
                removeComments: true,
                declaration: true,
                experimentalDecorators: true,
                lib: ["es2015", "es2015.iterable", "dom"],
            },
            include: ["src/**/*.ts"],
            reports: {
                html: "./coverage/",
            },
        },
        singleRun: true,
        port: 9876,
        colors: true,
        reporters: ["dots", "karma-typescript"],
        browsers: ["ChromeHeadless"],
        logLevel: config.LOG_INFO,
        autoWatch: false,
        concurrency: Infinity,
    });
};
