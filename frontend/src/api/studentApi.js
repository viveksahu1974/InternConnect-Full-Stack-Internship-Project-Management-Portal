import client from './client';

export const studentApi = {
  getProfile: () => client.get('/students/me/profile').then((r) => r.data),
  updateProfile: (payload) => client.put('/students/me/profile', payload).then((r) => r.data),
  addSkill: (payload) => client.post('/students/me/skills', payload).then((r) => r.data),
  removeSkill: (id) => client.delete(`/students/me/skills/${id}`).then((r) => r.data),
  dashboard: () => client.get('/students/me/dashboard').then((r) => r.data),
};
