import api from './client';

export const aiApi = {
  generateBlueprint: async (ideaId, customPrompt = '') => {
    const res = await api.post(`/ideas/${ideaId}/blueprint/generate`, { customPrompt });
    return res.data;
  },

  getStatus: async () => {
    const res = await api.get('/ai/status');
    return res.data;
  },
};
