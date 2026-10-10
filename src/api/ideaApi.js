import api from './client';

export const ideaApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/ideas', { params });
    return res.data;
  },

  getMyIdeas: async () => {
    const res = await api.get('/ideas/my');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/ideas/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/ideas', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/ideas/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/ideas/${id}`);
    return res.data;
  },
};
