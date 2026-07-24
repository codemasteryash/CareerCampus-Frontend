import api from '../axios'
export const certificationApi = {
  getRecommendations: () => api.get('/certifications/recommendations'),
  getMyCertifications: () => api.get('/certifications/me'),
  enroll: (data) => api.post('/certifications/enroll', data),
  updateStatus: (id, data) => api.patch(`/certifications/${id}/status`, data),
  remove: (id) => api.delete(`/certifications/${id}`),
}