import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function StudentNotifications() {
  const [state, setState] = useState({ status: 'loading', data: [] });

  const load = () => {
    notificationApi.list()
      .then((res) => setState({ status: 'ready', data: res.data.notifications }))
      .catch(() => setState({ status: 'error', data: [] }));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await notificationApi.markRead(id);
    load();
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading notifications..." />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-paper">Notifications</h1>
      <div className="mt-6">
        {state.data.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        ) : (
          <div className="space-y-2">
            {state.data.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.isRead && markRead(n.id)}
                className={`block w-full rounded-xl2 border p-4 text-left transition-colors ${n.isRead ? 'border-line bg-surface' : 'border-cyan/30 bg-cyan/5'}`}
              >
                <p className="text-sm font-medium text-paper">{n.title}</p>
                <p className="mt-1 text-sm text-mist">{n.message}</p>
                <p className="mt-2 text-xs text-mist">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
