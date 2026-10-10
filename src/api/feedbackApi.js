import api from './client';

export const feedbackApi = {
  getByIdea: async (ideaId) => {
    const res = await api.get(`/ideas/${ideaId}/feedback`);
    return res.data;
  },

  add: async (ideaId, data) => {
    const res = await api.post(`/ideas/${ideaId}/feedback`, data);
    return res.data;
  },

  update: async (feedbackId, data) => {
    const res = await api.put(`/feedback/${feedbackId}`, data);
    return res.data;
  },

  delete: async (feedbackId) => {
    const res = await api.delete(`/feedback/${feedbackId}`);
    return res.data;
  },
};
