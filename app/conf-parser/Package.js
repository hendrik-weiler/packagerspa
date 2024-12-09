/**
 * Package class
 */
export class Package {

    /**
     * Name
     * @type {string}
     */
    name = '';

    /**
     * Requires
     * @type {Array}
     */
    requires = [];

    /**
     * Directories
     * @type {[]}
     */
    directories = [];

    /**
     * Files
     * @type {[]}
     */
    files = [];

    /**
     * Options
     * @type {[]}
     */
    options = [];

    /**
     * Routes
     * @type {[Route]}
     */
    routes = [];

    /**
     * Constructor
     * @param name
     */
    constructor(name) {
        this.name = name;
    }
}