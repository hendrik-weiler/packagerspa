import {Lexer} from "./app/conf-parser/Lexer.js";
import {Parser} from "./app/conf-parser/Parser.js";
import {App} from "./app/conf-parser/App.js";
import fs from 'fs';

const fileContents = fs.readFileSync('./conf/app.conf').toString();

//console.log(fileContents);

let lexer = new Lexer(fileContents);

console.log(lexer.sum());

let app = new App();
let parser = new Parser(lexer, app);
parser.parse();

console.log(app);