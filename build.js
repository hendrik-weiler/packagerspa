import {Lexer} from "./app/conf-parser/Lexer.js";
import {Parser} from "./app/conf-parser/Parser.js";
import {App} from "./app/conf-parser/App.js";
import fs from 'fs';
import {Builder} from "./app/builder/Builder.js";

const fileContents = fs.readFileSync('./conf/app.conf').toString();

let app = new App();
let parser = new Parser(app);
parser.lexerFromFile('app.conf');

let builder = new Builder(parser);
builder.build();