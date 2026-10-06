import api from '../api';

export const AuthService = {
  getToken: () => localStorage.getItem('token'),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  clearToken: () => localStorage.removeItem('token'),

  async login(username, password) {
    const res = await api.post('/auth/login', { username, password });
    return res.data.token;
  },

  logout() {
    this.clearToken();
  }
};
