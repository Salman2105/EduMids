import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Users,
  CalendarDays,
  BarChart2,
  Settings,
  LogOut
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, href }) => (
  <Link
    to={href}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-white bg-opacity-10 text-white font-medium'
        : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </Link>
);

const TeacherDashboardSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="h-screen w-[250px] bg-black flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue rounded flex items-center justify-center">
          <span className="text-white font-bold">ED</span>
        </div>
        <h2 className="text-white font-bold text-xl">EduMids</h2>
      </div>
      <div className="mt-6 px-2 flex-1 flex flex-col gap-1">
        <SidebarItem
          icon={<Home size={18} />}
          label="Home"
          active={pathname === '/teacher'}
          href="/teacher"
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="My Classes"
          active={pathname === '/teacher/classes'}
          href="/teacher/classes"
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="Students"
          active={pathname === '/teacher/students'}
          href="/teacher/students"
        />
        <SidebarItem
          icon={<CalendarDays size={18} />}
          label="Schedule"
          active={pathname === '/teacher/schedule'}
          href="/teacher/schedule"
        />
        <SidebarItem
          icon={<BarChart2 size={18} />}
          label="Reports"
          active={pathname === '/teacher/reports'}
          href="/teacher/reports"
        />
      </div>
      <div className="mt-auto px-2 mb-6">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname === '/teacher/settings'}
          href="/teacher/settings"
        />
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Logout"
          href="/logout"
        />
      </div>
    </div>
  );
};

export default TeacherDashboardSidebar;