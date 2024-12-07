import {Ui} from "./Ui.js";

/**
 * This class represents the root of the application.
 */
export class App {

    /**
     * Contains all defined packages
     * @type {[]}
     */
    packages = [];

    /**
     * Contains all defined routes
     * @type {[]}
     */
    routes = [];

    /**
     * A callback function when routing happens
     * @type {[]}
     */
    authcallback = null;

    /**
     * The user interface definition
     * @type {null}
     */
    ui = new Ui();
}