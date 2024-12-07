/**
 * The main application class.
 */
class App {

    /**
     * The router instance
     * @type {null}
     */
    router = null;

    /**
     * Contains the loaded packages
     * @type {[]}
     */
    packageLoaded = [];

    /**
     * Constructor
     */
    constructor() {
        this.router = new Router();
    }

    /**
     * Initializes the application
     */
    init() {
        this.router.route();
    }

    view() {

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