import api from '../axios'
export const projectApi = {
  getRecommendations: () => api.get('/projects/recommendations'),
}
