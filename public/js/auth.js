/**
 * Authentication Manager
 * Handles user authentication, session management, and user interface updates
 */
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.sessionId = null;
    this.initializeAuth();
    this.attachEventListeners();
  }

  async initializeAuth() {
    // Check for existing session
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      try {
        const response = await API.request(`/api/auth/session/${sessionId}`);
        this.currentUser = response.user;
        this.sessionId = sessionId;
        this.updateUI();
      } catch (error) {
        // Session expired or invalid
        localStorage.removeItem('sessionId');
      }
    }
  }

  attachEventListeners() {
    // Login modal
    document.getElementById('loginBtn').addEventListener('click', () => {
      this.showModal('loginModal');
    });

    // Register modal
    document.getElementById('registerBtn').addEventListener('click', () => {
      this.showModal('registerModal');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logout();
    });

    // Saved filters
    document.getElementById('savedFiltersBtn').addEventListener('click', () => {
      this.showSavedFilters();
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      this.handleLogin(e);
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
      this.handleRegister(e);
    });

    // Save current filter
    document.getElementById('saveFilterBtn').addEventListener('click', () => {
      this.saveCurrentFilter();
    });
  }

  showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  async handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = {
      username: formData.get('username'),
      password: formData.get('password')
    };

    try {
      const response = await API.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      this.currentUser = response.user;
      this.sessionId = response.sessionId;
      localStorage.setItem('sessionId', this.sessionId);
      
      this.updateUI();
      this.closeModal('loginModal');
      Toast.success('로그인되었습니다!');
      
      // Reset form
      event.target.reset();
    } catch (error) {
      Toast.error('로그인에 실패했습니다: ' + error.message);
    }
  }

  async handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      Toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    const registerData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: password
    };

    try {
      const response = await API.request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      this.currentUser = response.user;
      this.sessionId = response.sessionId;
      localStorage.setItem('sessionId', this.sessionId);
      
      this.updateUI();
      this.closeModal('registerModal');
      Toast.success('회원가입이 완료되었습니다!');
      
      // Reset form
      event.target.reset();
    } catch (error) {
      Toast.error('회원가입에 실패했습니다: ' + error.message);
    }
  }

  async logout() {
    try {
      if (this.sessionId) {
        await API.request('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: this.sessionId })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    this.currentUser = null;
    this.sessionId = null;
    localStorage.removeItem('sessionId');
    this.updateUI();
    Toast.success('로그아웃되었습니다.');
  }

  updateUI() {
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const username = document.getElementById('username');

    if (this.currentUser) {
      authSection.style.display = 'none';
      userSection.style.display = 'block';
      username.textContent = this.currentUser.username;
    } else {
      authSection.style.display = 'block';
      userSection.style.display = 'none';
    }
  }

  async showSavedFilters() {
    if (!this.currentUser) {
      Toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const savedFilters = await API.request(`/api/saved-filters/${this.currentUser.id}`);
      this.displaySavedFilters(savedFilters);
      this.showModal('savedFiltersModal');
    } catch (error) {
      Toast.error('저장된 필터를 불러오지 못했습니다.');
    }
  }

  displaySavedFilters(savedFilters) {
    const container = document.getElementById('savedFiltersList');
    
    if (savedFilters.length === 0) {
      container.innerHTML = '<p class="no-filters">저장된 필터가 없습니다.</p>';
      return;
    }

    container.innerHTML = savedFilters.map(filter => `
      <div class="saved-filter-item">
        <div class="filter-info">
          <h5>${filter.name}</h5>
          <small>${new Date(filter.createdAt).toLocaleDateString()}</small>
        </div>
        <div class="filter-actions">
          <button onclick="authManager.loadFilter(${filter.id})" class="btn secondary">적용</button>
          <button onclick="authManager.deleteFilter(${filter.id})" class="btn danger">삭제</button>
        </div>
      </div>
    `).join('');
  }

  async saveCurrentFilter() {
    if (!this.currentUser) {
      Toast.error('로그인이 필요합니다.');
      return;
    }

    const filterName = document.getElementById('filterName').value.trim();
    if (!filterName) {
      Toast.error('필터 이름을 입력해주세요.');
      return;
    }

    try {
      // Get current filter state from FilterManager
      const currentFilters = window.filterManager.getFilters();
      
      await API.request('/api/saved-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentUser.id,
          name: filterName,
          filterData: currentFilters
        })
      });

      Toast.success('필터가 저장되었습니다!');
      document.getElementById('filterName').value = '';
      this.showSavedFilters(); // Refresh the list
    } catch (error) {
      Toast.error('필터 저장에 실패했습니다.');
    }
  }

  async loadFilter(filterId) {
    try {
      const savedFilters = await API.request(`/api/saved-filters/${this.currentUser.id}`);
      const filter = savedFilters.find(f => f.id === filterId);
      
      if (filter) {
        const filterData = JSON.parse(filter.filterData);
        window.filterManager.loadFilters(filterData);
        this.closeModal('savedFiltersModal');
        Toast.success('필터가 적용되었습니다!');
      }
    } catch (error) {
      Toast.error('필터 로드에 실패했습니다.');
    }
  }

  async deleteFilter(filterId) {
    if (!confirm('정말로 이 필터를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await API.request(`/api/saved-filters/${filterId}?userId=${this.currentUser.id}`, {
        method: 'DELETE'
      });

      Toast.success('필터가 삭제되었습니다.');
      this.showSavedFilters(); // Refresh the list
    } catch (error) {
      Toast.error('필터 삭제에 실패했습니다.');
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Global functions for modal controls
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
  closeModal('loginModal');
  document.getElementById('registerModal').style.display = 'flex';
}

function switchToLogin() {
  closeModal('registerModal');
  document.getElementById('loginModal').style.display = 'flex';
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});