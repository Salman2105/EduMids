import React from "react";
import { Input } from "./ui/input"; // Adjusted import path
import { Search, Bell } from "lucide-react";
import { Avatar } from "./ui/avatar"; // Adjusted import path

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Dashboard Title */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
        <div className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </div>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="User avatar"
            className="rounded-full"
          />
        </Avatar>
      </div>
    </div>
  );
};

export default SearchBar;
