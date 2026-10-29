import client from './client';

export const submissionApi = {
  create: (taskId, payload) => client.post(`/submissions/task/${taskId}`, payload).then((r) => r.data),
  listForMentor: (params) => client.get('/submissions', { params }).then((r) => r.data),
  review: (id, payload) => client.put(`/submissions/${id}/review`, payload).then((r) => r.data),
};
