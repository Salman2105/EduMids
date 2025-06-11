import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  UserCog,
  BarChart2,
  Award,
  CreditCard,
  // Calendar,
  Settings,
  LogOut,
  Home,
  MessageSquare, // <-- Added for Question/Answer
  Download, // <-- Added for Downloads
  Briefcase // <-- Added for Management
} from 'lucide-react';

const SidebarItem = ({ icon, label, active, href, onClick }) => (
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
        <span>{label}</span>
      </Link>
    ) : (
      <>
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </>
    )}
  </div>
);

const AdminDashboardSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to landing/home page
  };

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
          active={pathname === '/admin/dashboard'}
          href="/admin/dashboard"
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="Students/Teachers"
          active={pathname === '/admin/manage-users'}
          href="/admin/manage-users"
        />
        <SidebarItem
          icon={<BarChart2 size={18} />}
          label="Reports"
          active={pathname === '/admin/reports'}
          href="/admin/reports"
        />
        <SidebarItem
          icon={<Award size={18} />}
          label="Certificates"
          active={pathname === '/admin/certificates'}
          href="/admin/certificates"
        />
        <SidebarItem
          icon={<Download size={18} />} // <-- Downloads icon
          label="Downloads"
          active={pathname === '/admin/downloads'}
          href="/admin/DownloadPage"
        />
        <SidebarItem
          icon={<CreditCard size={18} />}
          label="Payment Summary"
          active={pathname === '/admin/payment-summary'}
          href="/admin/paymentSummary"
        />
         <SidebarItem
          icon={<MessageSquare size={18} />} // <-- Calendar icon added here
          label="QnAs"
          active={pathname === '/admin/questions'}
          href="/admin/questions"
        /> 
        <SidebarItem
          icon={<Briefcase size={18} />} // <-- Management icon
          label="Management"
          active={pathname === '/admin/management'}
          href="/admin/management"
        />
      </div>
      <div className="mt-auto px-2 mb-6">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={pathname === '/admin/settings'}
          href="/admin/settings"
        />
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default AdminDashboardSidebar;
