import {Type} from "./Type.js";
import {Package} from "./Package.js";
import {Route} from "./Route.js";

/**
 * Parses a conf file
 */
export class Parser {

    /**
     * Current token
     * @type {null}
     */
    currentToken = null;

    /**
     * Lexer
     * @type {null}
     */
    lexer = null;

    /**
     * The application instance
     * @type {App}
     */
    app = null;

    /**
     * Current package
     * @type {null}
     */
    currentPackage = null;

    /**
     * Constructor
     * @param lexer The lexer class
     * @param app The app class
     */
    constructor(lexer, app) {
        this.lexer = lexer;
        this.app = app;
        this.currentToken = this.lexer.getNextToken();
    }

    /**
     * Eats a token
     * @param type
     */
    eat(type) {
        //console.log('trying to eat: ' + type);
        if(this.currentToken.type === type) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.lexer.error(type);
        }
    }

    /**
     * Checks package
     */
    checkPackage() {
        while ([Type.OPTION, Type.COMMENT, Type.REQUIRES, Type.SEMICOLON, Type.DIRECTORY, Type.FILE].includes(this.currentToken.type)) {
            switch(this.currentToken.type) {
                case Type.REQUIRES:
                    this.eat(Type.REQUIRES);
                    if (this.currentToken.type === Type.VALUE) {
                        this.currentPackage.requires.push(this.currentToken.value);
                        this.eat(Type.VALUE);
                        this.eat(Type.SEMICOLON);
                    }
                    break;
                case Type.DIRECTORY:
                    this.eat(Type.DIRECTORY);
                    if (this.currentToken.type === Type.VALUE) {
                        this.currentPackage.directories.push(this.currentToken.value);
                        this.eat(Type.VALUE);
                        this.eat(Type.SEMICOLON);
                    }
                    break;
                case Type.FILE:
                    this.eat(Type.FILE);
                    if (this.currentToken.type === Type.VALUE) {
                        this.currentPackage.files.push(this.currentToken.value);
                        this.eat(Type.VALUE);
                        this.eat(Type.SEMICOLON);
                    }
                    break;
                case Type.OPTION:
                    this.eat(Type.OPTION);
                    if (this.currentToken.type === Type.VALUE) {
                        this.currentPackage.options.push(this.currentToken.value);
                        this.eat(Type.VALUE);
                        this.eat(Type.SEMICOLON);
                    }
                    break;
            }
            if(this.currentToken.type === Type.COMMENT) {
                this.eat(Type.COMMENT);
            }
            if(this.currentToken.type === Type.SEMICOLON) {
                this.eat(Type.SEMICOLON);
            }
        }
    }

    /**
     * Parses the file
     */
    parse() {
        while ([
            Type.COMMENT,
            Type.PACKAGE,
            Type.SEMICOLON,
            Type.ROUTES,
            Type.UI,
            Type.MIDDLEWARE
        ].includes(this.currentToken.type)) {

            if(this.currentToken.type === Type.PACKAGE) {
                this.eat(Type.PACKAGE);
                if(this.currentToken.type === Type.VALUE) {
                    this.currentPackage = new Package(this.currentToken.value);
                    this.app.packages.push(this.currentPackage);
                    this.eat(Type.VALUE);
                }
                this.eat(Type.BRACKETS_START);

                this.checkPackage();

                this.eat(Type.BRACKETS_END);
            }
            if(this.currentToken.type === Type.ROUTES) {
                this.eat(Type.ROUTES);
                this.eat(Type.BRACKETS_START);

                this.checkRoutes();

                this.eat(Type.BRACKETS_END);
            }
            if(this.currentToken.type === Type.UI) {
                this.eat(Type.UI);
                this.eat(Type.BRACKETS_START);

                this.checkUi();

                this.eat(Type.BRACKETS_END);
            }
            if(this.currentToken.type === Type.MIDDLEWARE) {
                this.eat(Type.MIDDLEWARE);
                if(this.currentToken.type === Type.VALUE) {
                    this.app.middlewares.push(this.currentToken.value);
                    this.eat(Type.VALUE);
                }
                this.eat(Type.SEMICOLON);
            }
            if(this.currentToken.type === Type.COMMENT) {
                this.eat(Type.COMMENT);
            }
            if(this.currentToken.type === Type.SEMICOLON) {
                this.eat(Type.SEMICOLON);
            }
        }
    }

    /**
     * Evalutes the ui
     */
    checkUi() {
        while ([Type.COMMENT, Type.SEMICOLON, Type.COMMA, Type.VALUE, Type.TEMPLATE, Type.ASSETS, Type.JAVASCRIPT, Type.STYLESHEETS].includes(this.currentToken.type)) {
            switch(this.currentToken.type) {
                case Type.TEMPLATE:
                    this.eat(Type.TEMPLATE);
                    this.loopThroughList((value) => this.app.ui.template.push(value));
                    break;
                case Type.ASSETS:
                    this.eat(Type.ASSETS);
                    this.loopThroughList((value) => this.app.ui.assets.push(value));
                    break;
                case Type.JAVASCRIPT:
                    this.eat(Type.JAVASCRIPT);
                    this.loopThroughList((value) => this.app.ui.javascript.push(value));
                    break;
                case Type.STYLESHEETS:
                    this.eat(Type.STYLESHEETS);
                    this.loopThroughList((value) => this.app.ui.stylesheets.push(value));
                    break;
            }
            if(this.currentToken.type === Type.COMMENT) {
                this.eat(Type.COMMENT);
            }
            if(this.currentToken.type === Type.SEMICOLON) {
                this.eat(Type.SEMICOLON);
            }
        }
    }

    /**
     * Parses the route layout
     * @param route
     */
    parseRouteLayout(route) {
        if(this.currentToken.type === Type.LAYOUT) {
            this.eat(Type.LAYOUT);
            this.eat(Type.COLON);
            if(this.currentToken.type === Type.VALUE) {
                route.layout = this.currentToken.value;
                this.eat(Type.VALUE);
            }
        }
    }

    /**
     * Evaluates the routes
     */
    checkRoutes() {
        while ([Type.COMMENT, Type.SEMICOLON, Type.VALUE].includes(this.currentToken.type)) {
            switch(this.currentToken.type) {
                case Type.VALUE:
                    let path = this.currentToken.value;
                    this.eat(Type.VALUE);
                    this.eat(Type.COLON);
                    let template = this.currentToken.value;
                    let route = new Route(path, template, []);
                    this.eat(Type.VALUE);
                    this.parseRouteLayout(route);
                    this.loopThroughList((value) => route.depends.push(value));
                    while ([Type.COMMA, Type.LAYOUT, Type.INDEX, Type.ERROR404, Type.PRIVATE].includes(this.currentToken.type)) {
                        if(this.currentToken.type === Type.COMMA) {
                            this.eat(Type.COMMA);
                        }
                        this.routeOptions(route);
                        this.parseRouteLayout(route);
                    }
                    this.app.routes.push(route);
                    this.eat(Type.SEMICOLON);
                    break;
            }
            if(this.currentToken.type === Type.COMMENT) {
                this.eat(Type.COMMENT);
            }
            if(this.currentToken.type === Type.SEMICOLON) {
                this.eat(Type.SEMICOLON);
            }
        }
    }

    /**
     * Parses the route options
     * @param route The route
     */
    routeOptions(route) {
        if(this.currentToken.type === Type.ERROR404) {
            this.eat(Type.ERROR404);
            route.error404 = true;
        }
        if(this.currentToken.type === Type.INDEX) {
            this.eat(Type.INDEX);
            route.index = true;
        }
        if(this.currentToken.type === Type.PRIVATE) {
            this.eat(Type.PRIVATE);
            route.private = true;
        }
    }

    /**
     * Loops througha  list
     * @param callback The callback for function for getting the value
     */
    loopThroughList(callback) {
        if (this.currentToken.type === Type.SQUARE_BRACKETS_START) {
            this.eat(Type.SQUARE_BRACKETS_START);
            while ([Type.VALUE, Type.COMMA].includes(this.currentToken.type)) {
                if (this.currentToken.type === Type.COMMA) {
                    this.eat(Type.COMMA);
                }
                if (this.currentToken.type === Type.VALUE) {
                    callback(this.currentToken.value);
                    this.eat(Type.VALUE);
                }
            }
            this.eat(Type.SQUARE_BRACKETS_END);
        }
    }
}