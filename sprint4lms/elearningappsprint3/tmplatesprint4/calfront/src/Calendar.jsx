import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment);

export default function MyCalendar({ events, onSlotSelect }) {
  return (
    <Calendar
      localizer={localizer}
      selectable
      events={events}
      defaultView="week"
      onSelectSlot={onSlotSelect}
      style={{ height: 600 }}
    />
  );
}
