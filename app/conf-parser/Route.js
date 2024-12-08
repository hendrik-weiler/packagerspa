/**
 * Route class
 */
export class Route {
    /**
     * Name
     * @type {string}
     */
    path = "";

    /**
     * Value
     * @type {string}
     */
    template = "";

    /**
     * Depends on packages
     * @type {[]}
     */
    depends = [];

    /**
     * The layout of the route
     * @type {null}
     */
    layout = null;

    /**
     * Is this a 404 error route
     * @type {boolean}
     */
    error404 = false;

    /**
     * Is this the index route
     * @type {boolean}
     */
    index = false;

    /**
     * Is this a private route
     * @type {boolean}
     */
    private = false;

    /**
     * Constructor
     * @param path The path of the route
     * @param template The template of the route
     * @param depends The package dependencies
     */
    constructor(path, template, depends) {
        this.path = path;
        this.template = template;
        this.depends = depends;
    }
}