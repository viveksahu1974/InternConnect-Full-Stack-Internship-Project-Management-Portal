import client from './client';

export const notificationApi = {
  list: () => client.get('/notifications').then((r) => r.data),
  markRead: (id) => client.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => client.put('/notifications/read-all').then((r) => r.data),
};
