import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/theme-toggle";
import { useAuthStore } from "../lib/auth";
import { cn } from "../lib/utils";
// import "./styles/header.css"; // Assuming you have a CSS file for header styles
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown,
  X 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function Header({ sidebarOpen, onSidebarToggle, showSidebarToggle }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeSearchOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {!showSidebarToggle && (
            <Link to="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                  <span >E</span>
                </div>
                <span className="text-xl font-bold text-primary">EduMinds</span>
              </div>
            </Link>
          )}
          
          {isAuthenticated && (
            <div className={cn(
              "relative",
              isSearchOpen ? "md:w-64 w-full" : "md:w-64 w-0"
            )}>
              <input 
                type="text" 
                placeholder="Search courses, lessons..." 
                className={cn(
                  "w-full py-2 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                  !isSearchOpen && "md:block hidden"
                )}
                onBlur={closeSearchOnMobile}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" />
              
              {!isSearchOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden" 
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 mr-4">
          <Link to="/">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Home</span>
          </Link>
          <Link to="/ServicesPage">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Services</span>
          </Link>
          <Link to="/courses">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Courses</span>
          </Link>
          {/* <Link to="/pricing">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Pricing</span>
          </Link> */}
          <Link to="/AboutPage">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">About Us</span>
          </Link>
          <Link to="/contact">
            <span className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium text-sm cursor-pointer">Contact</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:ring-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user?.profileImage || "https://github.com/shadcn.png"} 
                        alt={user?.fullName || "User"} 
                      />
                      <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{user?.fullName || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/auth/login">
                <Button className="bg-blue-300" variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-blue-300" size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-2">
          <nav className="flex flex-col space-y-2 px-4">
            <Link to="/">
              <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Home</span>
            </Link>
            <Link to="/ServicesPage">
              <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Services</span>
            </Link>
            <Link to="/courses">
              <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Courses</span>
            </Link>
            {/* <Link to="/pricing">
              <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Pricing</span>
            </Link> */}
            <Link to="/AboutPage">
              <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">About Us</span>
            </Link>
            <Link to="/contact">
              <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Contact</span>
            </Link>
            {!isAuthenticated && (
              <>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Link to="/auth/login">
                    <span className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium">Log in</span>
                  </Link>
                  <Link to="/auth/register">
                    <span className="block py-2 text-primary font-medium">Sign up</span>
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
