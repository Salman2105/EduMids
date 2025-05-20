
import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";const LandingPage = () => {
  return (
    <><div className="min-h-screen bg-gradient-to-br from-blue-100 to-white text-gray-800">
      <header className="flex justify-between items-center p-6 bg-white shadow">
    
        <h1 className="text-2xl font-bold text-blue-500">EduMids-Your PathWay To Khowledge </h1>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="text-center py-20 px-4">
        {/* <img src="./public/assets/land.jpg" alt="landpagege" /> */}
        <h2 className="text-4xl font-extrabold mb-4">Welcome to EduMids</h2>
        <p className="text-lg mb-8">
          Your all-in-one Learning Management System for Students, Teachers, and Admins.
        </p>
 {/* <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            className="pl-10 pr-4 w-[300px] bg-gray-50"
            placeholder="Search for students/teachers/documents..."
          />
        </div> */}
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-10">
          <div className="bg-white rounded shadow p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Students</h3>
            <p>      
                <img src="./public/assets/Student.jpg" alt="landpagege" />
              Track your course progress, take quizzes, and earn certificates.</p>
          </div>
          <div className="bg-white rounded shadow p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Teachers</h3>
            <p>
               <img src="./public/assets/Teacher2.jpg" alt="landpagege" />Create and manage courses, lessons, and student enrollments.</p>
          </div>
          <div className="bg-white rounded shadow p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Admins</h3>
            <p>
              <img src="./public/assets/Admin.png" alt="landpagege" />Oversee the entire platform, generate reports, and manage users.</p>
          </div>
        </div>
      </main>
    </div>
      <Footer />
</>
  );
};

export default LandingPage;
