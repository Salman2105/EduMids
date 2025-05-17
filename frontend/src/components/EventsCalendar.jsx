import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Adjusted import path

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentDate = new Date();
const currentDay = currentDate.getDate();

// Sample events data
const events = [
  { id: 1, title: "School Annual Function", date: "18 Jan 2023", type: "blue" },
  { id: 2, title: "Sport Competition", date: "26 Jan 2023", type: "red" },
];

const EventsCalendar = () => {
  // Generate calendar days for January 2023
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const isEventDay = [9, 18, 26].includes(i);
      const eventType = i === 18 ? "blue" : i === 26 ? "red" : undefined;

      days.push({
        day: i,
        isToday: i === currentDay,
        hasEvent: isEventDay,
        eventType,
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Card className="col-span-1 lg:col-span-2 h-[400px]">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Events Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-400 hover:text-gray-900">•••</button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-400 hover:text-gray-900">&lt;</button>
            <span className="font-medium">January 2023</span>
            <button className="text-sm text-gray-400 hover:text-gray-900">&gt;</button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-4">
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ day, isToday, hasEvent, eventType }) => (
              <div
                key={day}
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm
                  ${isToday ? "bg-school-blue text-white" : ""}
                  ${hasEvent && eventType === "blue" ? "bg-blue-100" : ""}
                  ${hasEvent && eventType === "red" ? "bg-red-100" : ""}
                `}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                event.type === "blue" ? "bg-blue-50" : "bg-red-50"
              }`}
            >
              <div
                className={`w-2 h-8 rounded-full ${
                  event.type === "blue" ? "bg-blue-500" : "bg-red-500"
                }`}
              ></div>
              <div>
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-gray-500">{event.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Community Section */}
        <div className="mt-4 p-4 bg-school-blue rounded-lg text-white">
          <div className="mb-2">
            <h3 className="font-medium text-sm">Join the community and find out more...</h3>
          </div>
          <button className="text-xs bg-white text-school-blue font-medium py-1 px-3 rounded-md">
            Explore now
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCalendar;
