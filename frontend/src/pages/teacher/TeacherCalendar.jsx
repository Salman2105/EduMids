import React from 'react'
import EventsCalendar from "../../components/EventsCalendar"
import RollmentCircle from "../../components/rollment"

export default function TeacherCalendar() {
  return (
    <div className="flex flex-row justify-center items-start gap-20 w-full mt-10">
      <div className="flex-shrink-0 mt-10 ml-1">
        <RollmentCircle />
      </div>
      <div className="flex-shrink-0" style={{ width: 540, minWidth: 320 }}>
        <EventsCalendar />
      </div>
    </div>
  )
}

