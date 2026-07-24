import api from '../axios'
export const mentorApi = {
  chat: (data) => api.post('/mentor/chat', data),
}