import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  CalendarDays, 
  CreditCard, 
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

const UserDashboardSidebar = () => {
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
          active={pathname === '/user'} 
          href="/user" 
        />
        <SidebarItem 
          icon={<BookOpen size={18} />} 
          label="My Courses" 
          active={pathname === '/user/courses'} 
          href="/user/courses" 
        />
        <SidebarItem 
          icon={<CalendarDays size={18} />} 
          label="Schedule" 
          active={pathname === '/user/schedule'} 
          href="/user/schedule" 
        />
        <SidebarItem 
          icon={<CreditCard size={18} />} 
          label="Payments" 
          active={pathname === '/user/payments'} 
          href="/user/payments" 
        />
      </div>
      <div className="mt-auto px-2 mb-6">
        <SidebarItem 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={pathname === '/user/settings'} 
          href="/user/settings" 
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

export default UserDashboardSidebar;