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
     * Options
     * @type {[]}
     */
    options = [];

    /**
     * Constructor
     * @param name
     */
    constructor(name) {
        this.name = name;
    }
}