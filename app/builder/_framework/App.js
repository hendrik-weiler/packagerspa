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
     * The middleware functions
     * @type {[]}
     */
    middlewares = [];

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
     * The dialogs node
     * @type {null}
     */
    dialogsNode = null;

    /**
     * The url params
     * @type {[]}
     */
    urlParams = [];

    /**
     * The get parameter function
     * @type {null}
     */
    getParams = new URLSearchParams(window.location.search);

    /**
     * The current dialog route
     * @type {null}
     */
    currentDialogRoute = null;

    /**
     * The dialog routes queue
     * @type {[]}
     */
    dialogRoutesQueue = [];

    /**
     * The initialized flag
     * @type {boolean}
     */
    initialized = false;

    /**
     * Constructor
     */
    constructor() {
        this.progressIndicatorElm = document.getElementById('pi');
        this.templateNode = document.getElementById('templates');
        this.layoutNode = document.getElementById('layouts');
        this.dialogsNode = document.getElementById('dialogs');
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
        if(config.middlewares) this.middlewares = config.middlewares;
        if(config.basePackages) this.basePackages = config.basePackages;
        console.log('Base packages', this.basePackages);
        await this.loadBasePackages();
        console.log('Base packages loaded');
        this.router.prepareViews(this.router.routes);
        this.router.route();
        this.initialized = true;
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

    /**
     * Shows a modal based on a path
     * @param path The path to the template
     */
    async showModal(path) {
       this.currentDialogRoute = await this.router.showModal(path);
       if(this.dialogRoutesQueue.includes(this.currentDialogRoute)) return;
       this.dialogRoutesQueue.push(this.currentDialogRoute);
    }

    /**
     * Closes a dialog based on a path
     * @param path The path to the dialog
     */
    closeDialog(path) {
        if(arguments.length===0) {
            if(this.dialogRoutesQueue.length === 0) {
                console.log('No dialog to close');
                return;
            }
            let dialogRoute = this.dialogRoutesQueue.pop();
            path = dialogRoute.path;
        }
        this.router.closeDialog(path);
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