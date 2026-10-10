import api from './client';

export const similarityApi = {
  getSimilar: async (ideaId, minThreshold = 15) => {
    const res = await api.get(`/ideas/${ideaId}/similar`, {
      params: { minThreshold },
    });
    return res.data;
  },
};
