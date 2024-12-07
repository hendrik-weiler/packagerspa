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