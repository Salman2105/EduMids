import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search, Bell } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState(""); // Add this line
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage (assuming user object is stored after login)
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    console.log("User from localStorage:", user);
    if (user && user.name && user.name.length > 0) {
      setUserInitial(user.name[0].toUpperCase());
      setUserName(user.name); // Add this line
    }

    // Fetch unread notifications count
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token from localStorage:", token);
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const unread = data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchNotifications();
  }, []);

  // Handler for bell click
  const handleBellClick = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin/notifications");
    } else if (role === "teacher") {
      navigate("/teacher/notifications");
    } else {
      navigate("/student/notifications");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Dashboard Title */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">
          {userName ? `Welcome ${userName}` : "Welcome"}
        </h1>
      </div>

      {/* Search Bar and Notifications */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            className="pl-10 pr-4 w-[300px] bg-gray-50"
            placeholder="Search for students/teachers/documents..."
          />
        </div>

        {/* Notifications */}
        <div className="relative flex items-center">
          <Bell
            size={20}
            className="text-gray-600 cursor-pointer"
            onClick={handleBellClick}
          />
          {unreadCount > 0 && (
            <span
              className="absolute flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full"
              style={{
                top: '-6px',
                right: '-6px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                lineHeight: '18px',
                fontSize: '12px',
                zIndex: 10,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {/* User Avatar */}
        <Avatar className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-bold">
          {userInitial || "✨"}
        </Avatar>
      </div>
    </div>
  );
};

export default SearchBar;


