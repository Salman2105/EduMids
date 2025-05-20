import React from 'react'
import EventsCalendar from "../../components/EventsCalendar"
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

export default function TeacherCalendar() {
  return (
    <div>
       <SearchBar/>
<EventsCalendar/>
<Footer/>
      
    </div>
  )
}

