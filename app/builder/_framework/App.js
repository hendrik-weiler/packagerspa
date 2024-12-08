/**
 * The main application class.
 */
class App {

    /**
     * The router instance
     * @type {Router}
     */
    router = null;

    /**
     * Contains the loaded packages
     * @type {[]}
     */
    packageLoaded = [];

    /**
     * The auth callback
     * @type {null}
     */
    authcallback = null;

    /**
     * The base packages to load
     * @type {null}
     */
    basePackages = null;

    /**
     * Progress indicator elm
     * @type {null}
     */
    progressIndicatorElm = null;

    /**
     * The events instance
     * @type {Events}
     */
    events = new Events();

    /**
     * The template node
     * @type {Element}
     */
    templateNode = null;

    /**
     * The layout node
     * @type {null}
     */
    layoutNode = null;

    /**
     * Constructor
     */
    constructor() {
        this.progressIndicatorElm = document.getElementById('pi');
        this.templateNode = document.getElementById('templates');
        this.layoutNode = document.getElementById('layouts');
        this.router = new Router(this);
    }

    /**
     * Shows the progress indicator
     */
    showPi() {
        this.progressIndicatorElm.showModal();
    }

    /**
     * Hides the progress indicator
     */
    hidePi() {
        this.progressIndicatorElm.close();
    }

    /**
     * Initializes the application
     */
    async init(config) {
        if(config.authcallback) this.authcallback = config.authcallback;
        if(config.basePackages) this.basePackages = config.basePackages;
        await this.loadBasePackages();
        this.router.prepareViews(this.router.routes);
        this.router.route();
    }

    /**
     * Loads a javascript file
     * @param path The path
     * @returns {Promise<unknown>}
     */
    async loadJs(path) {
        return new Promise((accept,reject) => {
            let script = document.createElement('script');
            script.onload = () => {
                this.packageLoaded.push(path);
                accept();
            }
            script.onerror = () => {
                reject();
            }
            script.src = 'packages/' + path + '.data.js?'+Date.now();
            document.body.appendChild(script);
        });
    }

    /**
     * Loads a css file
     * @param path The path to the file
     * @returns {Promise<unknown>}
     */
    async loadCss(path) {
        return new Promise((accept,reject) => {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'packages/' + path + '.data.css?'+Date.now();
            document.body.appendChild(link);
            this.packageLoaded.push(path);
            accept();
        });
    }

    /**
     * Loads all base packages
     * @returns {Promise<void>}
     */
    async loadBasePackages() {
        this.showPi();
        for (let i = 0; i < this.basePackages.template.length; ++i) {
            await this.loadJs(this.basePackages.template[i]);
        }
        for (let i = 0; i < this.basePackages.assets.length; ++i) {
            await this.loadJs(this.basePackages.assets[i]);
        }
        for (let i = 0; i < this.basePackages.javascript.length; ++i) {
            await this.loadJs(this.basePackages.javascript[i]);
        }
        for (let i = 0; i < this.basePackages.stylesheets.length; ++i) {
            await this.loadCss(this.basePackages.stylesheets[i]);
        }
        this.hidePi();
    }

    /**
     * Check if a package was loaded or not
     * @param pgkName The package name
     * @returns {boolean}
     */
    isPackageLoaded(pgkName) {
        return this.packageLoaded.includes(pgkName);
    }
}

/**
 * The current application instance
 * @type {null}
 */
var currentApp = null;

/**
 * Returns the current application instance
 * @returns {null}
 */
function app() {
    if(currentApp === null) {
        currentApp = new App();
    }
    return currentApp;
}