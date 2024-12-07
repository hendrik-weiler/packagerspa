import fs from 'fs';
import { globSync } from 'glob';
import path from 'node:path';

/**
 * Builder class
 */
export class Builder {

    /**
     * Parser instance
     * @type {null}
     */
    parser = null;

    /**
     * App instance
     * @type {null}
     */
    app = null;

    /**
     * Images to embed
     * @type {{}}
     */
    imagesToEmbed = {};

    /**
     * Constructor
     * @param parser
     */
    constructor(parser) {
        this.parser = parser;
        this.parser.parse();
    }

    /**
     * Build the app
     */
    build() {
        console.log('Building app');
        this.createBuildDir();
        let app = this.app = this.parser.app;
        let htmlPackages = [];
        let otherPackages = [];
        // search through all packages
        for (let i = 0; i < app.packages.length; i++) {
            let pkg = app.packages[i];
            for(let path of pkg.directories) {
                if(/\.html$/.test(path)) {
                    htmlPackages.push(pkg);
                    break;
                } else {
                    otherPackages.push(pkg);
                    break;
                }
            }
        }
        // first create other packages
        for(let pkg of otherPackages) {
            this.createPackage(pkg);
        }
        // then create html packages to embed images
        for(let pkg of htmlPackages) {
            this.createPackage(pkg);
        }
        this.createIndex();
        fs.cpSync('app/builder/_framework', 'build/_framework', {recursive: true});
    }

    /**
     * Create build directory
     */
    createBuildDir() {
        if(fs.existsSync('build')) {
            fs.rmSync('build', {recursive: true});
        }
        fs.mkdirSync('build');
    }

    /**
     * Convert file name to variable name
     * @param filePath The path to the file
     * @param ext The file extension
     * @returns {string}
     */
    convertFileNameToVariableName(filePath, ext) {
        filePath = filePath.replaceAll('/','_').replaceAll('.','_').replaceAll(ext,'');
        return filePath;
    }

    /**
     * Replace template
     * @param content The content
     * @returns {*}
     */
    replaceTemplate(content) {
        let pattern = /<img(.*)\/?>/g,
            groups = pattern.exec(content);
        while (groups != null) {
            let template = groups[0];
            if(/embed/.test(template)) {
                let src = groups[1].match(/embed src="(.*)"/)[1],
                    path = 'public/' + src,
                    varname = this.convertFileNameToVariableName(path, path.substring(path.lastIndexOf('.')));
                if (this.imagesToEmbed[varname]) {
                    console.log('replace: ' + src + ' with ' + varname);
                    content = content.replace(src, this.imagesToEmbed[varname]);
                }
            }
            groups = pattern.exec(content);
        }

        return content;
    }

    /**
     * Create package
     * @param pkg The package instance
     */
    createPackage(pkg) {
        console.log('Creating package: ' + pkg.name);
        let pkgName = 'build/' + pkg.name + '.data',
            content = '',
            i,
            isJs = false,
            isCSS = false;
        for(i=0; i < pkg.files.length; i++) {
            let file = pkg.files[i];
            let result = this.getContenFromFile(content, file);
            content = result.content;
            isJs = result.isJs;
            isCSS = result.isCSS;
        }
        for(i=0; i < pkg.directories.length; i++) {
            let dir = pkg.directories[i];
            for(let file of globSync(dir)) {
                let result = this.getContenFromFile(content, file);
                content = result.content;
                isJs = result.isJs;
                isCSS = result.isCSS;
            }
        }
        if(isJs) pkgName += '.js';
        if(isCSS) pkgName += '.css';
        fs.writeFileSync(pkgName, content);
    }

    getContenFromFile(content, file) {
        let ext = path.extname(file),
            isJs = false,
            isCSS = false;
        if(ext === '.html') {
            let filepath = this.convertFileNameToVariableName(file,'.html');
            let fileContent = this.replaceTemplate(fs.readFileSync(file).toString());
            content += 'var '+ filepath +' = `' + fileContent + '`;\n';
            isJs = true;
        } else if(ext === '.svg') {
            let filepath = this.convertFileNameToVariableName(file,'.svg');
            let base64Content = this.toBase64('image/svg+xml', file);
            let fileContent = 'var '+ filepath +' = "' + base64Content +'";\n';
            this.imagesToEmbed[filepath] = base64Content;
            content += fileContent;
            isJs = true;
        } else if(ext === '.png') {
            let filepath = this.convertFileNameToVariableName(file,'.png');
            let base64Content = this.toBase64('image/png', file);
            let fileContent = 'var '+ filepath +' = "' + base64Content +'";\n';
            this.imagesToEmbed[filepath] = base64Content;
            content += fileContent;
            isJs = true;
        } else if(ext === '.js') {
            content += fs.readFileSync(file) + ';\n';
            isJs = true;
        } else if(ext === '.css') {
            content += fs.readFileSync(file) + ';\n';
            isCSS = true;
        }
        return {content, isJs, isCSS};
    }

    /**
     * Convert file to base64
     * @param mime The mime type
     * @param file The file path
     * @returns {string}
     */
    toBase64(mime, file) {
        return "data:"+mime+";base64,"+Buffer.from(fs.readFileSync(file)).toString('base64');
    }

    /**
     * Add routes
     * @returns {string}
     */
    addRoutes() {
        let content = '';
        for(let route of this.app.routes) {
            content += `
                app().router.addRoute({
                    path : "${route.path}",
                    template : "${route.template}",
                    error404 : ${route.error404},
                    layout : "${route.layout}",
                    index : ${route.index},
                    depends : ${JSON.stringify(route.depends)}
                });
            \n`;
        }
        return content;
    }

    /**
     * Create index file
     */
    createIndex() {

        let indexContent = fs.readFileSync('public/index.html').toString(),
            i,
            app = this.app,
            scriptContent = '';

        if(app.ui == null) {
            throw new Error('UI not defined');
        }

        scriptContent += '<script src="_framework/Router.js"></script>\n';
        scriptContent += '<script src="_framework/App.js"></script>\n';

        for(i=0; i < app.ui.javascript.length; i++) {
            let pkg = app.ui.javascript[i];
            scriptContent += '<script src="'+pkg+'.data.js"></script>\n';
        }

        for(i=0; i < app.ui.template.length; i++) {
            let pkg = app.ui.template[i];
            scriptContent += '<script src="'+pkg+'.data.js"></script>\n';
        }

        for(i=0; i < app.ui.assets.length; i++) {
            let pkg = app.ui.assets[i];
            scriptContent += '<script src="'+pkg+'.data.js"></script>\n';
        }

        for(i=0; i < app.ui.stylesheets.length; i++) {
            let pkg = app.ui.stylesheets[i];
            scriptContent += '<link rel="stylesheet" href="'+pkg+'.data.css"/>\n';
        }

        scriptContent += '<script>' + this.addRoutes() + '</script>\n';
        scriptContent += '<script>app().init();</script>\n';

        indexContent = indexContent.replaceAll('</body>', scriptContent + '</body>');
        fs.writeFileSync('build/index.html', indexContent);
    }

}