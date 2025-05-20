import React from "react";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentDate = new Date();
const currentDay = currentDate.getDate();

// Sample events data
const events = [
  { id: 1, title: "Course Completion ", date: "18 Jan 2023", type: "blue", day: 18 },
  { id: 2, title: "Eid-ul-Fitr ", date: "26 Jan 2023", type: "red", day: 26 },
  { id: 3, title: "holiday", date: "20 Jan 2023", type: "dark", day: 20 },
];

const EventsCalendar = () => {
  // Generate calendar days for January 2023
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const event = events.find((e) => e.day === i);
      days.push({
        day: i,
        isToday: i === currentDay,
        eventType: event ? event.type : null,
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex justify-end w-full mt-8">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">Events Calendar</div>
          <button className="text-gray-400 hover:text-gray-900 text-xl">•••</button>
        </div>
        {/* Month Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <button className="text-gray-400 hover:text-gray-900 text-lg">&lt;</button>
          <span className="font-medium text-base">&lt; January 2023 &gt;</span>
          <button className="text-gray-400 hover:text-gray-900 text-lg">&gt;</button>
        </div>
        {/* Calendar Grid */}
        <div>
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ day, isToday, eventType }) => (
              <div
                key={day}
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm
                  ${isToday ? "bg-blue-600 text-white font-bold" : ""}
                  ${eventType === "blue" ? "bg-blue-100 text-blue-700" : ""}
                  ${eventType === "red" ? "bg-red-100 text-red-700" : ""}
                  ${eventType === "dark" ? "bg-gray-800 text-white" : ""}
                  ${!isToday && !eventType ? "hover:bg-gray-100" : ""}
                  transition
                `}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        {/* Events List */}
        <div className="space-y-2 mt-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                event.type === "blue"
                  ? "bg-blue-50"
                  : event.type === "red"
                  ? "bg-red-50"
                  : "bg-gray-100"
              }`}
            >
              <div
                className={`w-2 h-8 rounded-full ${
                  event.type === "blue"
                    ? "bg-blue-500"
                    : event.type === "red"
                    ? "bg-red-500"
                    : "bg-gray-800"
                }`}
              ></div>
              <div>
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-gray-500">{event.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
