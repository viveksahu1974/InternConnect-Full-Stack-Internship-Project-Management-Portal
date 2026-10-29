import client from './client';

export const internshipApi = {
  mine: () => client.get('/internships/mine').then((r) => r.data),
  list: () => client.get('/internships').then((r) => r.data),
  getById: (id) => client.get(`/internships/${id}`).then((r) => r.data),
};
