import client from './client';

export const milestoneApi = {
  listByInternship: (internshipId) => client.get(`/milestones/internship/${internshipId}`).then((r) => r.data),
  create: (internshipId, payload) => client.post(`/milestones/internship/${internshipId}`, payload).then((r) => r.data),
  update: (id, payload) => client.put(`/milestones/${id}`, payload).then((r) => r.data),
};

export const taskApi = {
  listByMilestone: (milestoneId) => client.get(`/tasks/milestone/${milestoneId}`).then((r) => r.data),
  create: (milestoneId, payload) => client.post(`/tasks/milestone/${milestoneId}`, payload).then((r) => r.data),
  update: (id, payload) => client.put(`/tasks/${id}`, payload).then((r) => r.data),
};
