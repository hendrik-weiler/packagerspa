/**
 * Token class
 */
export class Token {

    /**
     * Type
     * @type {string}
     */
    type = '';

    /**
     * Value
     * @type {string}
     */
    value = '';

    /**
     * Constructor
     * @param type The type
     * @param value The value
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}