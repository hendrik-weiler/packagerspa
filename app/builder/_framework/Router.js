/**
 * Router class
 */
class Router {

    /**
     * The routes
     * @type {[]}
     */
    routes = [];

    /**
     * The 404 route
     * @type {null}
     */
    route404 = null;

    /**
     * The index route
     * @type {null}
     */
    indexRoute = null;

    /**
     * Returns the app instance
     * @type {App}
     */
    app = null;

    /**
     * The unresolved routes
     * @type {[]}
     */
    unresolvedRoutes = [];

    /**
     * Constructor
     */
    constructor(app) {
        this.app = app;
        window.addEventListener('hashchange', this.route.bind(this));
    }

    /**
     * Adds a route
     * @param route The route
     */
    addRoute(route) {
      if(route.error404) {
        this.route404 = route;
      }
        if(route.index) {
            this.indexRoute = route;
        }
      this.routes.push(route);
    }

    /**
     * Navigates to a route
     */
    route() {
      let path = window.location.hash,
          found = false,
          pattern,
          groups;
        if(path === '') {
            if(this.indexRoute) {
                this.callRoute(this.indexRoute);
                return;
            }
        }
      for (let route of this.routes) {
        pattern = '^#'+route.path+'(/)?$';
        if (new RegExp(pattern).test(path)) {
            groups = path.match(new RegExp(pattern));
            this.app.urlParams = [];
            for (let i = 1; i < groups.length; i++) {
                this.app.urlParams.push(groups[i]);
            }
            this.app.urlParams.pop();
            found = true;
            console.log('Route found');
            this.callRoute(route);
            break;
        }
      }
      if(!found) {
        if(this.route404) {
            console.log('Using 404 route');
            this.callRoute(this.route404);
        }
      }
    }

    /**
     * Convert file path to variable name
     * @param filePath The path to the file
     * @param prefix The filepath prefix
     * @returns {string}
     */
    convertFileNameToVariableName(filePath, prefix ='public/templates/') {
        filePath = prefix + filePath;
        filePath = filePath
            .replaceAll('/','_')
            .replaceAll('.','_')
            .replaceAll('-','_');
        return filePath;
    }

    /**
     * Create a node from a template
     * @param templateVar The template variable
     * @returns {HTMLDivElement|null}
     */
    createNodeFromTemplate(templateVar) {
        if(window[templateVar]) {
            let node = document.createElement('div');
            node.dataset.template = templateVar;
            node.classList.add('template')
            node.classList.add('hidden');
            node.innerHTML = window[templateVar];
            return node;
        } else {
            return null;
        }
    }

    /**
     * Removes an unresolved route
     * @param route The route
     */
    removeUnresolvedRoute(route) {
        if(this.unresolvedRoutes.includes(route)) {
            let index = this.unresolvedRoutes.indexOf(route);
            this.unresolvedRoutes.splice(index, 1);
        }
    }

    /**
     * Prepares the views for the application
     */
    prepareViews(routes) {
        let layoutContent = {};
        for (let route of routes) {
            if(route.layout === 'null') {
                let template = this.convertFileNameToVariableName(route.template),
                    existingTemplateNode = this.app.templateNode.querySelector('[data-template="'+template+'"]'),
                    node = null;
                if(!existingTemplateNode) {
                    node = this.createNodeFromTemplate(template);
                    if(node) {
                        this.app.templateNode.appendChild(node);
                        route._varname = template;
                        route._node = node;
                        this.removeUnresolvedRoute(route);
                    } else {
                        console.log('Template not found: ' + template);
                        this.removeUnresolvedRoute(route);
                        this.unresolvedRoutes.push(route);
                    }
                } else {
                    node = existingTemplateNode;
                    route._node = node;
                }

            } else {
                let layoutTemplate = this.convertFileNameToVariableName(route.layout),
                    existingLayoutNode = this.app.layoutNode.querySelector('[data-template="'+layoutTemplate+'"]'),
                    layoutNode = null;
                if(!existingLayoutNode) {
                    layoutNode = this.createNodeFromTemplate(layoutTemplate);
                    if (layoutNode) {
                        this.app.layoutNode.appendChild(layoutNode);
                        route._layoutvarname = layoutTemplate;
                        route._layoutnode = layoutNode;
                        this.app.events.trigger('prepare_layout', {
                            mode: 'layout',
                            route: route
                        });
                        this.removeUnresolvedRoute(route);
                    } else {
                        console.log('Layout not found: ' + layoutTemplate);
                        this.removeUnresolvedRoute(route);
                        this.unresolvedRoutes.push(route);
                    }
                } else {
                    layoutNode = existingLayoutNode;
                    route._layoutnode = layoutNode;
                }

                if(!layoutContent[layoutTemplate]) {
                    layoutContent[layoutTemplate] = [];
                }

                let template = this.convertFileNameToVariableName(route.template);
                let existingTemplateNode = this.app.layoutNode.querySelector('[data-template="'+template+'"]');
                if(!existingTemplateNode) {
                    let node = this.createNodeFromTemplate(template);
                    if (node) {
                        this.app.layoutNode.appendChild(node);
                        route._varname = template;
                        route._node = node;
                        layoutContent[layoutTemplate].push({
                            node: node,
                            route: route
                        });
                        this.removeUnresolvedRoute(route);
                    } else {
                        console.log('Template not found: ' + template);
                        console.log(route)
                        this.removeUnresolvedRoute(route);
                        this.unresolvedRoutes.push(route);
                    }
                } else {
                    route._node = existingTemplateNode;
                    layoutContent[layoutTemplate].push({
                        node: existingTemplateNode,
                        route: route
                    });
                }
            }
            for(let layout in layoutContent) {
                let layoutNode = this.app.layoutNode.querySelector('[data-template="'+layout+'"]');
                if(layoutNode) {
                    let contentNode = layoutNode.querySelector('.content');
                    if(contentNode) {
                        for (let content of layoutContent[layout]) {
                            contentNode.appendChild(content.node);
                            this.app.events.trigger('prepare_template', {
                                mode: 'template',
                                route: content.route
                            });
                        }
                    } else {
                        console.log('No content node found in layout: ' + layout);
                    }
                } else {
                    console.log('No layout node found: ' + layout);
                }
            }
        }
    }

    /**
     * Updates the template
     * @param route
     */
    updateTemplate(route) {
        if(route._node || route._layoutnode) {
            let node = null;
            if(route._node) node = route._node;
            if(route._layoutnode) node = route._layoutnode;
            if(!node) {
                console.log('No node found for route');
                return;
            }
            let imgs = node.querySelectorAll('[data-src]'),
                i = 0;
            for(i=0; i < imgs.length; i++) {
                let img = imgs[i],
                    src = this.convertFileNameToVariableName(img.dataset.src, 'public/');
                if(window[src]) {
                    img.src = window[src];
                } else {
                    console.log('Image not found: ' + src);
                }
            }
            let elmBgs = node.querySelectorAll('[data-bg-src]');
            i = 0;
            for(i=0; i < elmBgs.length; i++) {
                let elmBg = elmBgs[i],
                    src = this.convertFileNameToVariableName(elmBg.dataset.bgSrc, 'public/');
                if(window[src]) {
                    elmBg.style.backgroundImage = 'url(' + window[src] + ')';
                } else {
                    console.log('Background image not found: ' + src);
                }
            }
        }
    }

    /**
     * Shows a route content
     * @param route The route to show
     */
    showRouteContent(route) {
        for (let theRoute of this.routes) {
            if(theRoute._layoutnode && !theRoute._layoutnode.classList.contains('hidden')) theRoute._layoutnode.classList.add('hidden');
            if(theRoute._node && !theRoute._node.classList.contains('hidden')) theRoute._node.classList.add('hidden');
        }
        if(route._layoutnode) route._layoutnode.classList.remove('hidden');
        if(route._node) route._node.classList.remove('hidden');
    }

    async walkThroughMiddlewares(route, middlewares ,next) {
        if(middlewares.length === 0) {
            next();
            return;
        }
        let middleware = middlewares.shift(),
            func = window[middleware];
        if(typeof func === 'function') {
            func(route, () => {
                this.walkThroughMiddlewares(route, middlewares, next);
            });
        } else {
            console.log('Middleware not found: ' + middleware);
            next();
        }
    }

    /**
     * Calls a route
     * @param route The route
     */
    async callRoute(route) {
        console.log('view route', route);
        this.walkThroughMiddlewares(route, this.app.middlewares.slice(), async () => {
            for (let dep of route.depends) {
                if(!this.app.isPackageLoaded(dep.replace(':js','').replace(':css',''))) {
                    this.app.showPi();
                    if(/:js/.test(dep)) {
                        await this.app.loadJs(dep.replace(':js',''));
                    }
                    if(/:css/.test(dep)) {
                        await this.app.loadCss(dep.replace(':css',''));
                    }
                    this.prepareViews(this.unresolvedRoutes.slice());
                    this.app.hidePi();
                }
            }

            this.showRouteContent(route);
            this.updateTemplate(route);
            // if there's a layout call display_layout
            if(route._layoutnode) {
                this.app.events.trigger('display_layout', {
                    mode : 'display',
                    route : route
                });
            }
            this.app.events.trigger('display_template', {
                mode : 'display',
                route : route
            });
        });
    }

    /**
     * Updates the routes
     */
    updateRoutes() {
        this.prepareViews(this.routes);
    }
}