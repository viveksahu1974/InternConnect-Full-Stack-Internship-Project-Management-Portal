import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Search, FileText, Briefcase, Flag, Send, MessageSquare,
  Bell, Settings, LogOut, Menu, X, Zap, Users, FolderKanban, BarChart3, ClipboardCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

const NAV = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/projects', label: 'Browse Projects', icon: Search },
    { to: '/student/applications', label: 'My Applications', icon: FileText },
    { to: '/student/internship', label: 'My Internship', icon: Briefcase },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
  ],
  mentor: [
    { to: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mentor/interns', label: 'My Interns', icon: Users },
    { to: '/mentor/reviews', label: 'Reviews', icon: ClipboardCheck },
    { to: '/mentor/applications', label: 'Applications', icon: FileText },
    { to: '/mentor/projects', label: 'My Projects', icon: FolderKanban },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/applications', label: 'Applications', icon: FileText },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = NAV[user.role] || [];

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-5 py-5 font-display text-lg font-semibold text-paper">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet text-ink">
          <Zap className="h-4 w-4" strokeWidth={2.5} />
        </span>
        InternConnect
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-mist hover:bg-surface2 hover:text-paper border border-transparent'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface2 text-sm font-semibold text-cyan">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-paper">{user.name}</p>
            <p className="truncate text-xs capitalize text-mist">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist transition-colors hover:bg-surface2 hover:text-paper"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface md:block">{SidebarContent}</aside>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-72 bg-surface border-r border-line">{SidebarContent}</div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-ink/85 px-5 py-4 backdrop-blur-md md:justify-end">
          <button className="text-paper md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <NotificationBell />
        </header>
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
