import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/program', label: 'Program' },
  { to: '/projects', label: 'Projects' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet text-ink">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          InternConnect
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-cyan' : 'text-mist hover:text-paper'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="rounded-lg border border-line px-4 py-2 text-sm text-paper transition-colors hover:border-cyan hover:text-cyan"
              >
                Dashboard
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="rounded-lg px-4 py-2 text-sm text-mist transition-colors hover:text-paper"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-mist transition-colors hover:text-paper">Login</Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-cyan to-violet px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-paper" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line/60 bg-ink px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm text-mist hover:text-paper">
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-line" />
            {user ? (
              <>
                <button onClick={() => { navigate(`/${user.role}/dashboard`); setOpen(false); }} className="text-left text-sm text-paper">
                  Dashboard
                </button>
                <button onClick={() => { logout(); navigate('/'); setOpen(false); }} className="text-left text-sm text-mist">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-mist">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium text-cyan">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
