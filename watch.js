import fs from 'fs';
import nodeWatch from 'recursive-watch';
import child_process from 'child_process';

console.log('Watching for changes in public folder...');
nodeWatch('./public', function (filename) {
    if (filename) {
        console.log('File changed: ' + filename);
        child_process.exec('node build.js', function (error, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
        });
    }
});
console.log('Watching for changes in conf folder...');
nodeWatch('./conf', function (filename) {
    if (filename) {
        console.log('File changed: ' + filename);
        child_process.exec('node build.js', function (error, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
        });
    }
});