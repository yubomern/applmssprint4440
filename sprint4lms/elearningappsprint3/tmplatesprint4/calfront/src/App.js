import React, { useEffect, useState } from "react";
import MyCalendar from "./Calendar";
import { fetchEvents, createEvent } from "./api";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(res => setEvents(res.data));
  }, []);

  const handleSelect = slot => {
    const title = prompt('Your Name to book:');
    if (!title) return;
    const meetLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}`;
    createEvent({ start: slot.start, end: slot.end, title, studentName: title, meetLink })
      .then(res => setEvents([...events, res.data]));
  };

  return (
    <div>
      <MyCalendar events={events.map(e => ({ ...e, title: `${e.title} 🗓️`, start: new Date(e.start), end: new Date(e.end) }))} onSlotSelect={handleSelect} />
      <p>Click a slot to book; event 📅 appended with meeting link</p>
    </div>
  );
}

export default App;
