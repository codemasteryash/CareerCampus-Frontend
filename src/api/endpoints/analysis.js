import api from '../axios'
export const analysisApi = {
  getAnalysis: () => api.get('/analysis'),
}
