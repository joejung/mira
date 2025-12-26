import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Ticket,
  Settings,
  Users,
  BarChart3,
  Cpu,
  Search,
  PlusCircle,
  Bell,
  Layout,
  Plus,
  User as UserIcon,
  LogOut,
  ChevronRight,
  Filter,
  Folder, // Keep Folder as it's used in NavItem
} from "lucide-react";
import Dashboard from "@/pages/Dashboard";
import IssuesPage from "@/pages/Issues";
import ProjectsPage from "@/pages/Projects";
import LoginPage from "@/pages/Login";
import { AppProvider, useAppContext } from "@/context/AppContext";

function AppContent() {
  const { activeTab, setActiveTab, user, logout } = useAppContext();

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
          <NavItem icon={<Cpu size={20} />} label="Chipsets" />
          <NavItem icon={<Users size={20} />} label="Teams" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <NavItem icon={<Settings size={20} />} label="Settings" />
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
            <Button className="rounded-full gap-2 bg-indigo-600 hover:bg-indigo-700">
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
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back, JNI-MP. Here's what's happening today.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="h-9 border-slate-200 dark:border-slate-800">Last 7 Days</Button>
                  <Button variant="outline" className="h-9 border-slate-200 dark:border-slate-800">Filter</Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Issues" value="156" change="+12%" />
                <StatCard label="Critical Bugs" value="23" change="-5%" trend="down" />
                <StatCard label="Open PRS" value="48" change="+8%" />
                <StatCard label="Team Velocity" value="28" suffix="pts" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800/40 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 group">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900/30">
                            <Ticket size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm group-hover:text-indigo-600 transition-colors">Audio jitter on MTK6873</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Updated 2h ago • Reported by Sarah Chen</div>
                          </div>
                          <Badge text="Critical" color="red" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Chipset Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <ChipsetProgress label="Qualcomm SD8 Gen 3" value={65} color="blue" />
                      <ChipsetProgress label="MediaTek Dimensity 9300" value={42} color="purple" />
                      <ChipsetProgress label="Exynos 2400" value={18} color="orange" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : activeTab === "issues" ? (
            <IssuesPage />
          ) : (
            <ProjectsPage />
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
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

function StatCard({ label, value, change, trend = "up", suffix = "" }: { label: string, value: string, change?: string, trend?: "up" | "down", suffix?: string }) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="pt-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{label}</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-3xl font-bold">{value}{suffix}</div>
          {change && (
            <span className={`text - xs font - medium px - 2 py - 0.5 rounded - full ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'} `}>
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Badge({ text, color }: { text: string, color: 'red' | 'blue' | 'green' | 'orange' }) {
  const colors = {
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
  }
  return <span className={`text - [10px] font - bold uppercase px - 2 py - 0.5 rounded - full tracking - wider ${colors[color]} `}>{text}</span>
}

function ChipsetProgress({ label, value, color }: { label: string, value: number, color: 'blue' | 'purple' | 'orange' }) {
  const barColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColors[color]} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
