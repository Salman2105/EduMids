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
        const token = localStorage.getItem("token");
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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Payment History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
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
              <tr key={p._id} className="text-center hover:bg-gray-50">
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
