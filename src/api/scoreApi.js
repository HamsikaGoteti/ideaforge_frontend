import api from './client';

export const scoreApi = {
  getScore: async (ideaId) => {
    const res = await api.get(`/ideas/${ideaId}/score`);
    return res.data;
  },

  reassess: async (ideaId) => {
    const res = await api.post(`/ideas/${ideaId}/reassess`);
    return res.data;
  },
};
