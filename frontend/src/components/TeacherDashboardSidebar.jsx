import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  PlusSquare,
  Users,
  Award,
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, href }) => (
  <Link
    to={href}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-white bg-opacity-10 text-black font-medium'
        : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-black'
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
    <div className="h-screen w-[250px] bg-blue-500 flex flex-col">
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
          active={pathname === '/teacher/dashboard'}
          href="/teacher/dashboard"
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="Created Courses"
          active={pathname === '/teacher/courses'}
          href="/teacher/courses"
        />
        <SidebarItem
          icon={<PlusSquare size={18} />}
          label="Add Lessons"
          active={pathname === '/teacher/add-lessons'}
          href="/teacher/add-lessons"
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="View Enrollments"
          active={pathname === '/teacher/enrollments'}
          href="/teacher/enrollments"
        />
        <SidebarItem
                  icon={<Award size={18} />}
                  label="Certificates"
                  active={pathname === '/teacher/certificates'}
                  href="/teacher/certificates"
                />
                <SidebarItem
           icon={<Calendar size={18} />} 
           label="Calendar"
      active={pathname === '/Teacher/TeacherCalendar'}
      href="/Teacher/TeacherCalendar"
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