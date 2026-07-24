import api from '../axios'
export const roadmapApi = {
  getMyRoadmap: () => api.get('/roadmap'),
  updateProgress: (data) => api.patch('/roadmap/progress', data),
}