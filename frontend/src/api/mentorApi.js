import client from './client';

export const mentorApi = {
  getProfile: () => client.get('/mentors/me/profile').then((r) => r.data),
  updateProfile: (payload) => client.put('/mentors/me/profile', payload).then((r) => r.data),
  interns: () => client.get('/mentors/me/interns').then((r) => r.data),
  dashboard: () => client.get('/mentors/me/dashboard').then((r) => r.data),
};
