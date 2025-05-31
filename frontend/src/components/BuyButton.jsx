import React from 'react'

export default function BuyButton({ course }) {
  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseName: course.title,
            price: course.price,
          }),
        });
        const data = await res.json();
        if (res.ok && data.id) {
          window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        } else {
          alert(data.message || "Payment session creation failed.");
        }
      }}
    >
      Buy Now (${course.price})
    </button>
  )
}
