import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationApi } from '../api/notificationApi';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = () => {
    notificationApi.list().then((res) => {
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markRead = async (id) => {
    await notificationApi.markRead(id);
    load();
  };

  const markAll = async () => {
    await notificationApi.markAllRead();
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mist hover:text-cyan hover:border-cyan transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan px-1 text-[10px] font-semibold text-ink">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-h-96 overflow-y-auto scrollbar-thin rounded-xl2 border border-line bg-surface shadow-glow">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-medium text-paper">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAll} className="text-xs text-cyan hover:text-cyan-soft">Mark all read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-mist">No notifications</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.isRead && markRead(n.id)}
                className={`block w-full border-b border-line/60 px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-surface2 ${!n.isRead ? 'bg-cyan/5' : ''}`}
              >
                <p className="font-medium text-paper">{n.title}</p>
                <p className="mt-0.5 text-xs text-mist">{n.message}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
