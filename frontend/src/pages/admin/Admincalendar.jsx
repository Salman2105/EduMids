import React, { useEffect, useState } from 'react'
import EventsCalendar from "../../components/EventsCalendar"
import RevenueCircle from "../../components/revenue"


function Admincalendar() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/admin-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch payment history");
        const data = await res.json();
        const total = data.reduce(
          (sum, p) =>
            sum +
            (p.price ||
              p.amount ||
              (p.course && p.course.price) ||
              0),
          0
        );
        setRevenue(total);
      } catch (err) {
        setRevenue(0);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="flex flex-row justify-center items-start gap-20 w-full mt-10">
      <div className="flex-shrink-0 mt-10 ml-1">
        <RevenueCircle revenue={revenue} />
      </div>
      <div className="flex-shrink-0" style={{ width: 540, minWidth: 320 }}>
        <EventsCalendar />
      </div>
    </div>
  );
}

export default Admincalendar
