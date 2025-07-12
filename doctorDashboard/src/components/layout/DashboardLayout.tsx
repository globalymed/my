
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  CreditCard, 
  MessageSquare, 
  Menu, 
  X,
  User,
  LogOut,
  Settings,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <Clock className="h-5 w-5" /> },
    { name: "Appointments", path: "/appointments", icon: <Calendar className="h-5 w-5" /> },
    { name: "Patients", path: "/patients", icon: <Users className="h-5 w-5" /> },
    { name: "Documents", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { name: "Invoices", path: "/invoices", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Availability", path: "/availability", icon: <Calendar className="h-5 w-5" /> },
    { name: "AI Assistant", path: "/chat", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col glassmorphism border-r border-doctor-100/20 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          {isSidebarOpen ? (
            <h1 className="text-xl font-semibold text-doctor-800 tracking-tight animate-fade-in">
              MedAssist
            </h1>
          ) : (
            <div className="w-8 h-8 rounded-full bg-doctor-500 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-doctor-600"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-doctor-500 text-white shadow-md"
                    : "text-doctor-800 hover:bg-doctor-100/80",
                  !isSidebarOpen && "justify-center"
                )}
              >
                <span className="icon-transition">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="ml-3 truncate animate-fade-in">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-doctor-100/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full flex items-center text-left",
                  !isSidebarOpen && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8 border border-doctor-100">
                  <AvatarImage src="/placeholder.svg" alt="Dr. Sarah Chen" />
                  <AvatarFallback className="bg-doctor-100 text-doctor-800">SC</AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <div className="ml-3 truncate animate-fade-in">
                    <p className="text-sm font-medium">Dr. Sarah Chen</p>
                    <p className="text-xs text-doctor-600">Cardiologist</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <header className="h-16 glassmorphism border-b border-doctor-100/20 sticky top-0 z-40 flex items-center justify-between px-6">
          <h2 className="text-lg font-medium">
            {navigationItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-doctor-600" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-doctor-500">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="cursor-pointer py-3">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-doctor-100 text-doctor-800">
                            {`P${i}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">New appointment request</p>
                          <p className="text-xs text-muted-foreground">Patient {i} requested an appointment</p>
                          <p className="text-xs text-doctor-600 mt-1">2 hour{i > 1 ? "s" : ""} ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  <span className="text-doctor-600 text-sm">View all notifications</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
