import client from './client';

export const projectApi = {
  list: (params) => client.get('/projects', { params }).then((r) => r.data),
  getById: (id) => client.get(`/projects/${id}`).then((r) => r.data),
  create: (payload) => client.post('/projects', payload).then((r) => r.data),
  update: (id, payload) => client.put(`/projects/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/projects/${id}`).then((r) => r.data),
};
