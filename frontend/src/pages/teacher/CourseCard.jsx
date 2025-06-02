import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CourseCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (picture) formData.append("picture", picture);

    // Always get token right before the request
    const token = localStorage.getItem("token");
    console.log("token from localStorage:", token); // Debug line

    if (!token) {
      setMessage("Invalid token. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/teacher/create-course", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Course created successfully!");
        setTitle("");
        setDescription("");
        setPicture(null);
        setPrice("");
        setCategory("");
        setCreatedCourse(data.course || {
          title,
          description,
          price,
          picture: picture ? URL.createObjectURL(picture) : null,
          _id: data.course?._id || Math.random().toString(36).slice(2, 10),
          category,
        });
      } else {
        // Show validation errors if present
        if (data.errors && Array.isArray(data.errors)) {
          setMessage(data.errors.map((err) => err.msg).join(", "));
        } else {
          setMessage(data.message || "Failed to create course.");
        }
      }
    } catch (err) {
      setMessage("Error creating course.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-blue-50 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
        {message && (
          <div className="mb-4 text-center text-sm text-blue-700">{message}</div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter course title"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="border px-3 py-2 rounded w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter course description"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Picture</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Price (pkr)</label>
            <input
              type="number"
              min="0"
              step="1"
              className="border px-3 py-2 rounded w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="Enter course price"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Category</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="Enter course category"
            />
          </div>
          {/* REMOVE createdBy hidden input */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
      {createdCourse && (
        <div className="flex justify-center mt-10">
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Created Course</h3>
            <div className="border rounded-xl bg-white shadow hover:shadow-lg transition transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden max-w-md">
              {createdCourse.picture && (
                <img
                  src={
                    createdCourse.picture.startsWith("uploads/")
                      ? `http://localhost:5000/${createdCourse.picture}`
                      : createdCourse.picture
                  }
                  alt={createdCourse.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-semibold">
                    Course ID: {(createdCourse._id || createdCourse.id)?.toString().slice(-6)}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{createdCourse.title}</h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">{createdCourse.description}</p>
                {createdCourse.price && (
                  <div className="text-base font-semibold text-green-700 mb-2">
                    PKR {parseFloat(createdCourse.price).toFixed(2)}
                  </div>
                )}
                {createdCourse.category && (
                  <div className="text-sm font-semibold text-blue-700 mb-2">
                    Category: {createdCourse.category}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
