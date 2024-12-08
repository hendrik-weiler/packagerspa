/**
 * The events class
 */
class Events {

    /**
     * Stores the events
     * @type {{}}
     */
    events = {};

    /**
     * Registers an event
     * @param eventname The event name
     * @param callback The callback function
     */
    on(eventname, callback) {
        if(!this.events[eventname]) {
            this.events[eventname] = [];
        }
        this.events[eventname].push(callback);
    }

    /**
     * Triggers an event
     *
     * @param eventname The event name
     * @param params A object of parameters
     */
    trigger(eventname, params) {
        if(this.events[eventname]) {
            for (let i = 0; i < this.events[eventname].length; ++i) {
                this.events[eventname][i](params);
            }
        } else {
            console.log('Event ' + eventname + ' not found');
        }
    }

}