import React from 'react'
import EventCalendar from "../../components/EventsCalendar";

export default function StudentCalendar() {
  return (
    <div>
      <EventCalendar/>
        <div className="p-4">
            <p>Welcome to your calendar! Here you can view all upcoming events, deadlines, and important dates related to your courses.</p>
            <p>Click on any event to see more details or to add it to your personal calendar.</p>
            </div>
    </div>
  )
}
