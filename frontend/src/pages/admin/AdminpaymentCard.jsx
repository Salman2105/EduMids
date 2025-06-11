import React, { useEffect, useState } from "react";

const AdminpaymentCard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // always get fresh token
        const res = await fetch("http://localhost:5000/api/admin/admin-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch payment history");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err.message || "Error fetching payment history");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-4">Loading payment history...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!payments.length) return <div className="p-4">No payment history found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2">All Payment History</h2>
          <p className="text-gray-600 text-base md:text-lg">
            View all student payments and course purchases.
          </p>
        </div>
        <img
          src="/assets/payment.png"
          alt="Payments"
          className="w-24 h-24 md:w-32 md:h-32 object-contain hidden md:block"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl shadow-lg">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 border-b">Student Name</th>
              <th className="py-2 px-4 border-b">Student Email</th>
              <th className="py-2 px-4 border-b">Course Title</th>
              <th className="py-2 px-4 border-b">Course Category</th>
              <th className="py-2 px-4 border-b">Amount (PKR)</th>
              <th className="py-2 px-4 border-b">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="text-center hover:bg-blue-50 transition">
                <td className="py-2 px-4 border-b">{p.student?.name || "-"}</td>
                <td className="py-2 px-4 border-b">{p.student?.email || "-"}</td>
                <td className="py-2 px-4 border-b">{p.course?.title || "-"}</td>
                <td className="py-2 px-4 border-b">{p.course?.category || "-"}</td>
                <td className="py-2 px-4 border-b">{p.amount}</td>
                <td className="py-2 px-4 border-b">{new Date(p.paymentDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminpaymentCard;
