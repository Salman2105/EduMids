import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuyButton({ course }) {
  const navigate = useNavigate();

  const handleBuy = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        courseName: course.title,
        price: course.price,
      }),
    });
    if (!res.ok) {
      // handle error
      return;
    }
    const data = await res.json();
    // Redirect to Stripe checkout
    window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handleBuy}
    >
      Buy Now (${course.price})
    </button>
  );
}
