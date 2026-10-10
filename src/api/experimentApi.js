import api from './client';

export const experimentApi = {
  getByIdea: async (ideaId) => {
    const res = await api.get(`/ideas/${ideaId}/experiments`);
    return res.data;
  },

  getById: async (expId) => {
    const res = await api.get(`/experiments/${expId}`);
    return res.data;
  },

  create: async (ideaId, data) => {
    const res = await api.post(`/ideas/${ideaId}/experiments`, data);
    return res.data;
  },

  update: async (expId, data) => {
    const res = await api.put(`/experiments/${expId}`, data);
    return res.data;
  },

  delete: async (expId) => {
    const res = await api.delete(`/experiments/${expId}`);
    return res.data;
  },
};
