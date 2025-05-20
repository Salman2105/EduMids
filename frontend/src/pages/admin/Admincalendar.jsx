import React from 'react'
import EventsCalendar from "../../components/EventsCalendar"
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

function Admincalendar() {
  return (
   <>
<SearchBar/>
<EventsCalendar/>
<Footer/>

   </>
  )
}

export default Admincalendar
