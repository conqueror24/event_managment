let events = [];
let attendeeId = 1; // Global tracker for unique IDs

class Event {
    constructor(name, attendees = []) {
        this.name = name;
        this.attendees = attendees; // Array of attendee objects
    }
}

module.exports = { events, Event, attendeeId };
