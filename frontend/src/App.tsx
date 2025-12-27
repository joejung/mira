import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/context/ThemeContext";

import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Cpu,
  Search,
  PlusCircle,
  Bell,
  Settings,
  Folder, // Keep Folder as it's used in NavItem
  LogOut,
} from "lucide-react";
import Dashboard from "@/pages/Dashboard";
import IssuesPage from "@/pages/Issues";
import ProjectsPage from "@/pages/Projects";
import LoginPage from "@/pages/Login";
import { AppProvider, useAppContext } from "@/context/AppContext";
import IssueForm from "@/components/IssueForm";

function AppContent() {
  const { activeTab, setActiveTab, user, showCreateIssue, setShowCreateIssue, logout } = useAppContext();

  const handlePlaceholderClick = (feature: string) => {
    alert(`${feature} feature is coming soon!`);
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold tracking-tight">mira</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <NavItem icon={<Ticket size={20} />} label="All Issues" active={activeTab === "issues"} onClick={() => setActiveTab("issues")} />
          <NavItem icon={<Folder size={20} />} label="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
          <NavItem icon={<Cpu size={20} />} label="Chipsets" onClick={() => handlePlaceholderClick("Chipsets")} />
          <NavItem icon={<Users size={20} />} label="Teams" onClick={() => handlePlaceholderClick("Teams")} />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" onClick={() => handlePlaceholderClick("Analytics")} />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => handlePlaceholderClick("Settings")} />
          <NavItem icon={<LogOut size={20} />} label="Log Out" onClick={logout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full w-96 border border-slate-200 dark:border-slate-700">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search issues, projects..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </Button>
            <Button 
              className="rounded-full gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setShowCreateIssue(true)}
            >
              <PlusCircle size={18} />
              <span>Create Issue</span>
            </Button>
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 overflow-hidden cursor-pointer">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=mira"
                alt="User Avatar"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" ? (
            <Dashboard />
          ) : activeTab === "issues" ? (
            <IssuesPage />
          ) : (
            <ProjectsPage />
          )}
        </div>
        
        {showCreateIssue && (
          <IssueForm 
            onClose={() => setShowCreateIssue(false)} 
            onSuccess={() => {
              setShowCreateIssue(false);
              // Optionally refresh data if we were using a query client
              if (activeTab === 'issues') {
                 // Force refresh hack or just let user navigate
                 window.location.reload(); 
              }
            }} 
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </AppProvider>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active
        ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 dark:shadow-none translate-x-1"
        : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
    </div>
  );
}


