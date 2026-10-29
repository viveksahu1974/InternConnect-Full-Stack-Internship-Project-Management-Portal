import client from './client';

export const applicationApi = {
  apply: (projectId, payload) => client.post(`/projects/${projectId}/apply`, payload).then((r) => r.data),
  mine: () => client.get('/applications/mine').then((r) => r.data),
  withdraw: (id) => client.put(`/applications/${id}/withdraw`).then((r) => r.data),
  list: (params) => client.get('/applications', { params }).then((r) => r.data),
  updateStatus: (id, status) => client.put(`/applications/${id}/status`, { status }).then((r) => r.data),
};
