import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import "./index.css";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
// import EventsCalendar from "./components/EventsCalendar";
import New from "./components/New";

// Admin
import AdminDashboardSidebar from "./components/AdminDashboardSidebar";
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from "./pages/admin/AdminStudents";
import AdminReports from "./pages/admin/AdminReports";
import PaymentSummary from "./pages/admin/PaymentSummary";
import AdminCalendar from "./pages/admin/AdminCalendar"
import AdminCertificates from "./pages/admin/AdminCertificates"; 


// Teacher
import TeacherDashboardSidebar from "./components/TeacherDashboardSidebar";
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherEnrollments from "./pages/teacher/TeacherEnrollments";
import TeacherCertificates from "./pages/Teacher/TeacherCertificates";
import TecherCalendar from "./pages/Teacher/TeacherCalendar"



// Student
import StudentDashboardSidebar from "./components/StudentDashboardSidebar";
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from "./pages/student/StudentCourses";
import StudentQuizzes from "./pages/student/StudentQuizzes";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentProgress from "./pages/student/StudentProgress";
import Footer from "./pages/Footer";

// Reusable layout wrappers for each role
const LayoutWithSidebar = ({ Sidebar, children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 overflow-y-auto p-4">
      {children}
       <Footer/>
    </div>
   
  </div>
);

function App() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin/dashboard"
            element={
              <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                <AdminDashboard />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                <AdminStudents />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                <AdminReports />
              </LayoutWithSidebar>
            }
          />
           <Route
            path="/admin/Certificates"
            element={
              <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                <AdminCertificates />
              </LayoutWithSidebar>
            }
            
          />
          <Route
            path="/admin/AdminCalendar"
            element={
              <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                <AdminCalendar />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/admin/PaymentSummary"
            element={
              <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                <PaymentSummary />
              </LayoutWithSidebar>
            }
          />
        </Route>
        

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route
            path="/teacher/dashboard"
            element={
              <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                <TeacherDashboard />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/teacher/courses"
            element={
              <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                <TeacherCourses />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/teacher/add-lessons"
            element={
              <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                <TeacherLessons />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/teacher/enrollments"
            element={
              <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                <TeacherEnrollments />
              </LayoutWithSidebar>
            }
          />
           <Route
            path="/teacher/Certificates"
            element={
              <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                <TeacherCertificates />
              </LayoutWithSidebar>
            }
          />
        </Route>
          <Route
            path="/Teacher/TeacherCalendar"
            element={
              <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                <TecherCalendar />
              </LayoutWithSidebar>
            }
          />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route
            path="/student/dashboard"
            element={
              <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                <StudentDashboard />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/student/courses"
            element={
              <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                <StudentCourses />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/student/progress"
            element={
              <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                <StudentProgress />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/student/quizzes"
            element={
              <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                <StudentQuizzes />
              </LayoutWithSidebar>
            }
          />
          <Route
            path="/student/certificates"
            element={
              <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                <StudentCertificates />
              </LayoutWithSidebar>
            }
          />
        </Route>
      </Routes>
    </AuthLayout>
  );
}

export default App;
