import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
    },
    async checkAuthState() {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        try {
          const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB9Cx6vMAu9DgAY4Ey2R199ZEc-IjXeQGM`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: userData.idToken,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
          }

          const data = await response.json();
          this.setUser(data.users[0]);
        } catch (error) {
          console.error('Ошибка при проверке состояния аутентификации:', error);
          this.clearUser();
        }
      }
    },
    async logout() {
      this.clearUser();
    },
  },
});
