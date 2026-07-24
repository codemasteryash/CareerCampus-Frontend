import api from '../axios'
export const roleApi = {
  getAllRoles: () => api.get('/roles'),
  getRoleById: (id) => api.get(`/roles/${id}`),
  searchRole: (title) => api.get(`/roles/search?title=${encodeURIComponent(title)}`),
}