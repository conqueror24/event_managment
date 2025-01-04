const events = []; // Array to store events
const fs = require('fs');
const Queues=require('../utils/Queues');
const PriorityTree = require('../utils/PriorityTree');

exports.createEvent = (req, res) => {
  const { eventName } = req.body;
  if (events.find((e) => e.name === eventName)) {
    return res.status(400).json({ error: 'Event already exists' });
  }

  const newEvent = {
    name: eventName,
    attendees: [],
    queue: new Queues(),
    priorityTree: new PriorityTree(),
  };

  events.push(newEvent);

 
  const eventDetails = `Event Name: ${eventName}\n`;
  fs.appendFile('event.txt', eventDetails, (err) => {
    if (err) {
      console.error('Error writing to event.txt:', err);
      return res.status(500).json({ error: 'Error creating event file' });
    }
  });

  res.status(201).json({ message: 'Event created', event: { name: eventName, attendees: [] } });
};

exports.addAttendee = (req, res) => {
  const { eventName, attendee } = req.body;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const newId = event.attendees.length + 1;
  const newAttendee = { ...attendee, id: newId };
  event.attendees.push(newAttendee);
  event.queue.enqueue(newAttendee);
  event.priorityTree.addChild('Root', newAttendee);

  res.status(201).json({ message: 'Attendee added', attendee: newAttendee });
};

exports.getEventDetails = (req, res) => {
  const { eventName } = req.params;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.status(200).json({ name: eventName, attendees: event.attendees });
};

exports.sortAttendees = (req, res) => {
  const { eventName } = req.params;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const sorted = [...event.attendees].sort((a, b) => a.preference.localeCompare(b.preference));
  res.status(200).json(sorted);
};

exports.priorityAttendees = (req, res) => {
  const { eventName } = req.params;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.status(200).json(event.priorityTree.getChildren('Root'));
};

exports.deleteAttendee = (req, res) => {
  const { eventName, id } = req.body;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const index = event.attendees.findIndex((a) => a.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: 'Attendee not found' });

  const deletedAttendee = event.attendees.splice(index, 1)[0];
  event.queue.items = event.queue.items.filter((a) => a.id !== parseInt(id));
  event.priorityTree.remove(deletedAttendee);

  res.status(200).json({ message: 'Attendee deleted', attendee: deletedAttendee });
};

exports.modifyAttendee = (req, res) => {
  const { eventName, id, updates } = req.body;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const attendee = event.attendees.find((a) => a.id === parseInt(id));
  if (!attendee) return res.status(404).json({ error: 'Attendee not found' });

  for (const [key, value] of Object.entries(updates)) {
    if (attendee[key] !== undefined) {
      attendee[key] = value;
    }
  }

  event.priorityTree.remove(attendee);
  event.priorityTree.addChild('Root', attendee);

  event.queue.items = event.queue.items.filter((a) => a.id !== parseInt(id));
  event.queue.enqueue(attendee);

  res.status(200).json({ message: 'Attendee updated successfully', attendee });
};

exports.dequeueAttendee = (req, res) => {
  const { eventName } = req.params;
  const event = events.find((e) => e.name === eventName);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  if (event.queue.isEmpty()) return res.status(400).json({ error: 'No attendees in the queue' });

  const dequeuedAttendee = event.queue.dequeue();
  res.status(200).json({ message: 'Attendee dequeued', attendee: dequeuedAttendee });
};
