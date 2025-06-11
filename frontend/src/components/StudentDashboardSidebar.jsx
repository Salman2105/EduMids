import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  BarChart2,
  FileCheck2,
  Award,
  // Calendar,
  Settings,
  LogOut,
  MessageSquare,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, href, onClick, collapsed }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
      active
        ? 'bg-white bg-opacity-10 text-black font-medium'
        : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-black'
    }`}
  >
    {href ? (
      <Link to={href} className="flex items-center gap-2 w-full h-full">
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    ) : (
      <>
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </>
    )}
  </div>
);

const StudentDashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to landing/home page
  };

  // Toggle sidebar collapse
  const handleToggle = () => setCollapsed((prev) => !prev);

  return (
    <div
      className={`h-screen ${collapsed ? 'w-[70px]' : 'w-[250px]'} bg-blue-500 flex flex-col transition-all duration-200`}
    >
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue rounded flex items-center justify-center">
          <span className="text-white font-bold">ED</span>
        </div>
        {!collapsed && <h2 className="text-white font-bold text-xl">EduMids</h2>}
        <button
          className={`ml-auto  rounded hover:bg-blue-600 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          onClick={handleToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={20} color="white" strokeWidth={3} />
            : <ChevronLeft size={20} color="white" strokeWidth={3} />}
        </button>
      </div>
      <div className="mt-6 px-2 flex-1 flex flex-col gap-1">
        <SidebarItem
          icon={<Home size={18} />}
          label="Home"
          active={pathname === '/student/dashboard'}
          href="/student/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="All Courses"
          active={pathname === '/student/all-courses'}
          href="/student/all-courses"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="My Courses"
          active={pathname === '/student/courses'}
          href="/student/courses"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BarChart2 size={18} />}
          label="Progress"
          active={pathname === '/student/progress'}
          href="/student/progress"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FileCheck2 size={18} />}
          label="Quizzes"
          active={pathname === '/student/quizzes'}
          href="/student/quizzes"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Award size={18} />}
          label="Certificates"
          active={pathname === '/student/certificates'}
          href="/student/certificates"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Download size={18} />}
          label="Downloads"
          active={pathname === '/student/downloads'}
          href="/student/DownloadPage"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<MessageSquare size={18} />}
          label="QnAs"
          active={pathname === '/student/questions'}
          href="/student/questions"
          collapsed={collapsed}
        />
      </div>
      <div className="mt-auto px-2 mb-6">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname === '/student/settings'}
          href="/student/settings"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Logout"
          onClick={handleLogout}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;