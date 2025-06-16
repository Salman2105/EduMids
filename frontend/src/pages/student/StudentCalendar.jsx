import React from 'react'
import EventCalendar from "../../components/EventsCalendar";
import PerformanceCircle from "../../components/performance"

export default function StudentCalendar() {
  return (
    <div className="flex flex-row justify-center items-start gap-20 w-full mt-10">
      <div className="flex-shrink-0 mt-10 ml-1">
        <PerformanceCircle />
      </div>
      <div className="flex-shrink-0" style={{ width: 540, minWidth: 320 }}>
        <EventCalendar />
      </div>
    </div>
  )
}
