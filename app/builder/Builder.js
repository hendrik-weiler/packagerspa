import fs from 'fs';
import { globSync } from 'glob';
import path from 'node:path';

export class Builder {

    parser = null;

    app = null;

    constructor(parser) {
        this.parser = parser;
        this.parser.parse();
    }

    build() {
        console.log('Building app');
        this.createBuildDir();
        let app = this.app = this.parser.app;
        for (let i = 0; i < app.packages.length; i++) {
            let pkg = app.packages[i];
            this.createPackage(pkg);
        }
        this.createIndex();
    }

    createBuildDir() {
        if(fs.existsSync('build')) {
            fs.rmSync('build', {recursive: true});
        }
        fs.mkdirSync('build');
    }

    convertFileNameToVariableName(filePath, ext) {
        filePath = filePath.replaceAll('/','_').replaceAll('.','_').replaceAll(ext,'');
        return filePath;
    }

    createPackage(pkg) {
        console.log('Creating package: ' + pkg.name);
        let pkgName = 'build/' + pkg.name + '.data',
            content = '',
            i,
            isJs = false,
            isCSS = false;
        for(i=0; i < pkg.directories.length; i++) {
            let dir = pkg.directories[i];
            for(let file of globSync(dir)) {
                let ext = path.extname(file);
                if(ext === '.html') {
                    let filepath = this.convertFileNameToVariableName(file,'.html');
                    content += 'var '+ filepath +' = `' + fs.readFileSync(file) + '`;\n';
                    isJs = true;
                } else if(ext === '.svg') {
                    let filepath = this.convertFileNameToVariableName(file,'.svg');
                    let fileContent = 'var '+ filepath +' = "data:text/svg+xml;base64,'+Buffer.from(fs.readFileSync(file)).toString('base64')+'";\n';
                    content += fileContent;
                } else if(ext === '.png') {
                    let filepath = this.convertFileNameToVariableName(file,'.png');
                    let fileContent = 'var '+ filepath +' = "data:text/png;base64,'+Buffer.from(fs.readFileSync(file)).toString('base64')+'";\n';
                    content += fileContent;
                } else if(ext === '.js') {
                    content += fs.readFileSync(file) + ';\n';
                    isJs = true;
                } else if(ext === '.css') {
                    content += fs.readFileSync(file) + ';\n';
                    isCSS = true;
                }
            }
        }
        if(isJs) pkgName += '.js';
        if(isCSS) pkgName += '.css';
        fs.writeFileSync(pkgName, content);
    }

    createIndex() {

        let indexContent = fs.readFileSync('public/index.html').toString(),
            i,
            app = this.app,
            scriptContent = '';

        if(app.ui == null) {
            throw new Error('UI not defined');
        }

        for(i=0; i < app.ui.javascript.length; i++) {
            let pkg = app.ui.javascript[i];
            scriptContent += '<script src="'+pkg+'.data.js"></script>\n';
        }

        for(i=0; i < app.ui.template.length; i++) {
            let pkg = app.ui.template[i];
            scriptContent += '<script src="'+pkg+'.data.js"></script>\n';
        }

        for(i=0; i < app.ui.stylesheets.length; i++) {
            let pkg = app.ui.stylesheets[i];
            scriptContent += '<link rel="stylesheet" href="'+pkg+'.data.css"/>\n';
        }

        indexContent = indexContent.replaceAll('</body>', scriptContent + '</body>');
        fs.writeFileSync('build/index.html', indexContent);
    }

}