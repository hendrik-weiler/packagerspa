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

Theres additionally files for osx, linux and windows

linux, osx:
- `build.sh`
- `watch.sh`

windows:
- `build.bat`
- `watch.bat`

### Configuration

In the conf folder there are bunch of .conf files.
The app.conf will be read from node but you can include other .conf files
to further structure your configuration.

### Common files to build folder

When specific files exist in the `public` folder these will be copied to the build folder

- .htaccess
- `custom` folder for everything else
- favicon.ico
- robots.txt

#### Url parameters

There are two ways to read url parameters.
- In the url use regex to match the parameters for example `'/test/([0-9]+)' : 'login.html';`. The matches are available in `app().urlParams`. It is an array.
- Retrieve get parameters using `app().getParams.get('param')`

#### Include a configuration file

You can include a configuration file in another configuration file.
```
include 'path/to/file.conf';
```

#### Comments

You can add comments to the configuration files.
```
// This is a comment
```

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

#### Add global routes

The route /404 is flagged as error404 page.
The route / is flagged as index page.
You can flag a route as dialog
```
routes {
    '/dialog': 'dialog.html', dialog;
    '/404': '404.html', error404;
    // you can flag a route as private and can be checked in a middleware
    '/private-page': 'login.html', private;
    '/': 'login.html', index,layout: 'layout/login.html';
}
```

#### Dialogs

You can open/close a dialog for example
```
<a onclick="app().showModal('/dialog');" href="javascript:">Show test dialog</a>
<a onclick="app().closeDialog();" href="javascript:">Close current dialog</a>
```

##### Package routes

You can add routes to a package. 
When the package gets loaded the routes will be added to the routing.
```
package 'about' {
    file 'public/templates/about.html';
    file 'public/templates/layout/about-layout.html'; // test
    file 'public/js/about.js';

    routes {
        '/about': 'about.html' ['about'],layout: 'layout/about-layout.html';
    }
}
```

#### Anonymous packages on route packages and ui

You can add anonymous packages to routes in a package.
```
routes {
    '/404': '404.html', error404;
    '/': 'login.html' [package {
        file 'public/img/splash.png';
        routes {
            '/ohmy': 'login.html' [package {
                file 'public/img/splash.png';
            }];
        }
    }], index,layout: 'layout/login.html';
}
```
You can also create anonymous packages in the ui.

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

### Working with views

When a route is loaded an event will be called. When the route is called through hash change
another event will be called.
You can listen to the event and manipulate the data.
```
// events for templates
// gets called once
app().events.on('prepare_template', function(e) {
    if(e.route.path !== '/nested') return; // check if the route is the one you want
    console.log('prepare nested', e.route.path);
});

// gets called every time the route is called
app().events.on('display_template', function(e) {
    if(e.route.path !== '/nested') return;
    console.log('display nested', e);
});

// events for layout
// gets called once
app().events.on('prepare_layout', function(e) {
    if(e.route.layout !== 'layout/login.html') return; // check if the layout is the one you want
    console.log('prepare layout login', e.route.path);
});

// gets called every time the layout is called
app().events.on('display_layout', function(e) {
    if(e.route.layout !== 'layout/login.html') return; // check if the layout is the one you want
    console.log('display layout login', e);
});
```