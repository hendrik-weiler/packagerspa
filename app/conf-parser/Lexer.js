import {Type} from "./Type.js";
import {Token} from "./Token.js";
import fs from 'fs';

/**
 * Lexer
 */
export class Lexer {

    /**
     * Current position
     * @type {number}
     */
    pos = 0;

    /**
     * Current line
     * @type {number}
     */
    line = 1;

    /**
     * Current line position
     * @type {number}
     */
    linePos = 0;

    /**
     * Text
     * @type {string}
     */
    text = '';

    /**
     * Current character
     * @type {string}
     */
    currentChar = '';

    /**
     * Constructor
     * @param text
     */
    constructor(text) {
        this.text = text;
        this.text = this.replaceIncludes(this.text, 'app.conf');
        console.log(this.text);
        this.currentChar = text[this.pos];
    }

    /**
     * Peeks a character
     * @param num
     * @returns {string}
     */
    peek(num = 1) {
        if(this.pos + num >= this.text.length) {
            return '';
        }
        return this.text[this.pos + num];
    }

    /**
     * Finds a keyword
     * @param keyword
     * @param num
     * @returns {boolean}
     */
    findKeyword(keyword, num = 1) {
        let found = true,
            value = '';
        for(let i = 0; i < num; i++) {
            value += this.text[this.pos + i];
        }
        return value === keyword;
    }

    /**
     * Advances the position
     * @param num
     */
    advance(num = 1) {
        for (let i = 0; i < num; i++) {
            this.addPos();
        }
    }

    /**
     * Adds 1 to the position
     */
    addPos() {
        this.pos++;
        this.linePos++;
        this.currentChar = this.text[this.pos];
    }

    /**
     * Gets a value within single quotes
     * @returns {string}
     */
    getValue() {
        let value = '';
        while (true) {
            this.addPos();
            if(this.currentChar === "'" || this.pos >= this.text.length) {
                break;
            }
            value += this.currentChar;
        }
        this.addPos();
        return value;
    }

    /**
     * Gets a comment
     * @returns {string}
     */
    getComment() {
        let value = '';
        while (true) {
            this.addPos();
            if(this.currentChar === "\n" || this.pos >= this.text.length) {
                this.line += 1;
                break;
            }
            value += this.currentChar;
        }
        this.addPos();
        return value;
    }

    /**
     * Sums the tokens
     * @returns {*[]}
     */
    sum() {
        let tokens = [],
            token = this.getNextToken();
        while (token.type !== Type.EOL) {
            tokens.push(token);
            token = this.getNextToken();
        }
        tokens.push(token);
        this.pos = 0;
        this.line = 1;
        this.linePos = 0;
        return tokens;
    }

    /**
     * Gets the next token
     * @returns {Token|*}
     */
    getNextToken() {
        if(this.pos >= this.text.length) {
            return new Token(Type.EOL, '');
        }

        this.currentChar = this.text[this.pos];

        if(this.currentChar === ' '
            || this.currentChar === "\t") {
            this.addPos();
            return this.getNextToken();
        }

        if(this.currentChar === "\n") {
            this.addPos();
            this.linePos = 1;
            this.line += 1;
            return this.getNextToken();
        }

        if(this.currentChar === "{") {
            this.addPos();
            return new Token(Type.BRACKETS_START, null);
        }

        if(this.currentChar === "'") {
            let value = this.getValue();
            return new Token(Type.VALUE, value);
        }

        if(this.currentChar === "}") {
            this.addPos();
            return new Token(Type.BRACKETS_END, null);
        }

        if(this.currentChar === ";") {
            this.addPos();
            return new Token(Type.SEMICOLON, null);
        }

        if(this.currentChar === ":") {
            this.addPos();
            return new Token(Type.COLON, null);
        }

        if(this.currentChar === "[") {
            this.addPos();
            return new Token(Type.SQUARE_BRACKETS_START, null);
        }

        if(this.currentChar === "]") {
            this.addPos();
            return new Token(Type.SQUARE_BRACKETS_END, null);
        }

        if(this.currentChar === ",") {
            this.addPos();
            return new Token(Type.COMMA, null);
        }

        if(this.currentChar === "/"
            && this.peek() === "/") {
            this.addPos();
            let value = this.getComment().trim();
            return new Token(Type.COMMENT, value);
        }

        if(this.findKeyword('requires', 8)) {
            this.advance(8);
            return new Token(Type.REQUIRES, null);
        }

        if(this.findKeyword('package', 7)) {
            this.advance(7);
            return new Token(Type.PACKAGE, null);
        }

        if(this.findKeyword('directory', 9)) {
            this.advance(9);
            return new Token(Type.DIRECTORY, null);
        }

        if(this.findKeyword('option', 6)) {
            this.advance(6);
            return new Token(Type.OPTION, null);
        }

        if(this.findKeyword('routes', 6)) {
            this.advance(6);
            return new Token(Type.ROUTES, null);
        }

        if(this.findKeyword('ui', 2)) {
            this.advance(2);
            return new Token(Type.UI, null);
        }

        if(this.findKeyword('template', 8)) {
            this.advance(8);
            return new Token(Type.TEMPLATE, null);
        }

        if(this.findKeyword('assets', 6)) {
            this.advance(6);
            return new Token(Type.ASSETS, null);
        }

        if(this.findKeyword('javascript', 10)) {
            this.advance(10);
            return new Token(Type.JAVASCRIPT, null);
        }

        if(this.findKeyword('stylesheets', 11)) {
            this.advance(11);
            return new Token(Type.STYLESHEETS, null);
        }

        if(this.findKeyword('layout', 6)) {
            this.advance(6);
            return new Token(Type.LAYOUT, null);
        }

        if(this.findKeyword('middleware', 10)) {
            this.advance(10);
            return new Token(Type.MIDDLEWARE, null);
        }

        if(this.findKeyword('error404', 8)) {
            this.advance(8);
            return new Token(Type.ERROR404, null);
        }

        if(this.findKeyword('index', 5)) {
            this.advance(5);
            return new Token(Type.INDEX, null);
        }

        if(this.findKeyword('file', 4)) {
            this.advance(4);
            return new Token(Type.FILE, null);
        }

        if(this.findKeyword('private', 7)) {
            this.advance(7);
            return new Token(Type.PRIVATE, null);
        }

        this.error();
    }

    /**
     * Throws an error
     * @param type The type to consume from parser
     */
    error(type) {
        let codeSnippet = '',
            tokenType = type || 'none';
        for(let i = this.pos - 10; i < this.pos; i++) {
            if(i < 0) break;
            codeSnippet += this.text[i];
        }
        for(let i = 0; i < 10; i++) {
            if(this.pos + i >= this.text.length) break;
            codeSnippet += this.text[this.pos + i];
        }
        if(tokenType !== 'none') {
            throw new Error(`Invalid character ${this.currentChar} at line ${this.line} position ${this.linePos}: 
            ${codeSnippet} expected ${tokenType}`);
        } else {
            throw new Error(`Invalid character ${this.currentChar} at line ${this.line} position ${this.linePos}: 
            ${codeSnippet}`);
        }
    }

    /**
     * Replaces includes with the files content
     */
    replaceIncludes(text, name) {
        let pattern = /include '(.*)';/g;
        let regex = pattern.exec(text);
        while (regex != null) {
            let filePath = './conf/' + regex[1],
                fileContents = '';
            if(fs.existsSync(filePath)) {
                fileContents = fs.readFileSync(filePath).toString();
                text = text.replace(regex[0], fileContents);
                return this.replaceIncludes(text, filePath);
            } else {
                console.log('Could not load ' + filePath + ' in ' + name);
            }
            regex = pattern.exec(text);
        }
        return text;
    }
}