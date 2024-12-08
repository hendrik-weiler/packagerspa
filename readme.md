# Packager SPA

This applications can package data and be configured
to lazy load additional data during routing.

### Pre-requisites

- Node.js 20.11.1 or higher

### Install

- `cd packagerspa` go to the root of the project
- `npm install` install all dependencies
- `node build.js` build the project as test

### Watch and building

- `node build.js` build the project
- `node watch.js` watch the project and build it

### Configuration

In the conf folder there are bunch of .conf files.
The app.conf will be read from node but you can include other .conf files
to further structure your configuration.

#### Create a package

```
package 'package-name' {
    // The path to the package
}
```

##### Add a file or directory

```
package 'package-name' {
    // The path to the package
    file 'path/to/file.js'
    directory 'path/to/directory/**/*.js'
}
```

#### Add routes

The route /404 is flagged as error404 page.
The route / is flagged as index page.
```
routes {
    '/404': '404.html', error404;
    '/': 'login.html', index,layout: 'layout/login.html';
}
```

#### Add dependencies to a route

```
// Create a package to depend on
package 'test' {
    file 'test.js'
}

routes {
    // Add a list of dependencies to the route
    '/test': 'test.html' ['test'];
}
```
When the route gets called the package 'test' will be loaded.
If theres a layout or a template in it, the missing data of the routes will be resolved.

### Middleware

You can use middleware functions to manipulate the routing.
```
middleware 'auth';
```

This is the signature of the auth function:
```
function auth(route, next) {
    // Do something
    next();
}
```
You can stack multiple middleware functions.

### UI

The ui configuration is used to define the base packages for the user interface.
```
// The user interface base packages
ui {
    template ['template']; // html
    assets ['assets']; // svg, png
    javascript ['js']; // js
    stylesheets ['bootstrap','style']; // css
}
```

### Images and background images

You can use the `data-bg-src="img/logo.svg"` attribute to load background images.
It will be added to the style attribute of the element.

For images `data-src="img/logo.svg"` to set the src of the image.
You can additionally use `<img embed src="img/logo.svg">` to embed the image in the template.