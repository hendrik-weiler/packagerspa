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
     * The app node
     * @type {Element}
     */
    appNode = null;

    /**
     * Returns the app instance
     * @type {App}
     */
    app = null;

    /**
     * Constructor
     */
    constructor(app) {
        this.app = app;
        this.appNode = document.getElementById('app');
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
          found = false;
        if(path === '') {
            if(this.indexRoute) {
                this.appNode.innerHTML = public_templates_test_html;
                return;
            }
        }
      for (let route of this.routes) {
        if (new RegExp('^#'+route.path+'(/)?$').test(path)) {
            found = true;
            console.log('Route found');
            this.callRoute(route);
            this.appNode.innerHTML = public_templates_test_html;
            break;
        }
      }
      if(!found) {
        if(this.route404) {
          console.log('Using 404 route');
          this.appNode.innerHTML = public_templates_404_html;
        }
      }
    }

    /**
     * Calls a route
     * @param route The route
     */
    async callRoute(route) {
        for (let dep of route.depends) {
            if(!this.app.isPackageLoaded(dep)) {
                this.app.showPi();
                if(/:js/.test(dep)) {
                    await this.app.loadJs(dep.replace(':js',''));
                }
                if(/:css/.test(dep)) {
                    await this.app.loadCss(dep.replace(':css',''));
                }
                this.app.hidePi();
            }
        }
        console.log('view route');
    }
}