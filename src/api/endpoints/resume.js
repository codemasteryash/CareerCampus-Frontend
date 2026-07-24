import api from '../axios'
export const resumeApi = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAnalysis: () => api.get('/resume/analysis'),
}