import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  PlusSquare,
  Users,
  Award,
  // Calendar,
  Settings,
  LogOut,
  User,
  HelpCircle,
  MessageSquare,
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

const TeacherDashboardSidebar = () => {
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

  const handleToggle = () => setCollapsed((prev) => !prev);

  return (
    <div
      className={`h-screen ${collapsed ? 'w-[70px]' : 'w-[250px]'} bg-blue-500 flex flex-col transition-all duration-200`}
    >
      <div className="p-4 flex items-center gap-2">
        {/* Teacher Book Logo */}
        <button
          onClick={() => {
            // Preserve all user details when navigating to landing page
            const currentUser = JSON.parse(localStorage.getItem("user")) || {};
            localStorage.setItem("user", JSON.stringify({
              ...currentUser,
              role: "teacher"
            }));
            navigate("/");
          }}
          className="flex items-center gap-2 focus:outline-none"
          style={{ background: 'none', border: 'none', padding: 0 }}
          aria-label="Go to landing page"
        >
          <svg
            width={collapsed ? 36 : 48}
            height={collapsed ? 36 : 48}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Book base */}
            <rect x="10" y="16" width="44" height="32" rx="6" fill="#fff" stroke="#1e40af" strokeWidth="2"/>
            {/* Book spine */}
            <rect x="30" y="16" width="4" height="32" fill="#2563eb"/>
            {/* Pen/pointer */}
            <rect x="48" y="22" width="3" height="18" rx="1.5" fill="#facc15" />
            <circle cx="49.5" cy="40.5" r="2" fill="#1e40af" />
          </svg>
          {!collapsed && (
            <div className="flex flex-col ml-2">
              <span className="text-white font-extrabold text-2xl tracking-wide logo-font" style={{letterSpacing: '2px'}}>EduMids</span>
              <span className="text-white text-xs font-light italic mt-1 opacity-80 logo-tagline">Pathway to Knowledge</span>
            </div>
          )}
        </button>
        <button
          className="ml-auto rounded hover:bg-blue-600 transition-colors"
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
          active={pathname === '/teacher/dashboard'}
          href="/teacher/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="Created Courses"
          active={pathname === '/teacher/courses'}
          href="/teacher/courses"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<PlusSquare size={18} />}
          label="Add Lessons"
          active={pathname === '/teacher/add-lessons'}
          href="/teacher/add-lessons"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="View Enrollments"
          active={pathname === '/teacher/enrollments'}
          href="/teacher/enrollments"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<User size={18} />}
          label="Students"
          active={pathname === '/teacher/students'}
          href="/teacher/students"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<HelpCircle size={18} />}
          label="Quiz"
          active={pathname === '/teacher/quiz'}
          href="/teacher/quiz"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Award size={18} />}
          label="Certificates"
          active={pathname === '/teacher/certificates'}
          href="/teacher/certificates"
          collapsed={collapsed}
        />
        {/* <SidebarItem
          icon={<Calendar size={18} />}
          label="Calendar"
          active={pathname === '/Teacher/TeacherCalendar'}
          href="/Teacher/TeacherCalendar"
          collapsed={collapsed}
        /> */}
        <SidebarItem
          icon={<MessageSquare size={18} />}
          label="QnAs"
          active={pathname === '/teacher/questions'}
          href="/teacher/questions"
          collapsed={collapsed}
        />
      </div>
      <div className="mt-auto px-2 mb-6">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname === '/teacher/settings'}
          href="/teacher/settings"
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

export default TeacherDashboardSidebar;