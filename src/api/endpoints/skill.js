import api from '../axios'
export const skillApi = {
  getAllSkills: () => api.get('/skills'),
  getSkillById: (id) => api.get(`/skills/${id}`),
  getMySkills: () => api.get('/skills/me'),
  addSkill: (data) => api.post('/skills/me', data),
  removeSkill: (skillId) => api.delete(`/skills/me/${skillId}`),
}