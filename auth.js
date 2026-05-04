/**
 * Authentication Module
 * Handles user authentication state management and login/logout functionality
 * @author Student Portal Team
 * @version 1.0.0
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} role - User's role (e.g., 'student')
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated - Whether user is logged in
 * @property {User|null} user - Current user data or null if not authenticated
 * @property {string|null} token - Authentication token or null
 */

/**
 * Authentication state manager
 */
class AuthManager {
  /**
   * Create an AuthManager instance
   */
  constructor() {
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    this.listeners = [];
    this.initializeFromStorage();
  }

  /**
   * Initialize authentication state from localStorage
   * @private
   */
  initializeFromStorage() {
    try {
      const storedAuth = localStorage.getItem('studentPortalAuth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        this.state = { ...this.state, ...authData };
        this.notifyListeners();
      }
    } catch (error) {
      console.warn('Failed to load auth state from storage:', error);
    }
  }

  /**
   * Save authentication state to localStorage
   * @private
   */
  saveToStorage() {
    try {
      localStorage.setItem('studentPortalAuth', JSON.stringify({
        isAuthenticated: this.state.isAuthenticated,
        user: this.state.user,
        token: this.state.token
      }));
    } catch (error) {
      console.warn('Failed to save auth state to storage:', error);
    }
  }

  /**
   * Add a listener for authentication state changes
   * @param {Function} listener - Callback function that receives the auth state
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   * @param {Function} listener - Callback function to remove
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of state changes
   * @private
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get current authentication state
   * @returns {AuthState} Current authentication state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is logged in
   */
  isAuthenticated() {
    return this.state.isAuthenticated;
  }

  /**
   * Get current user
   * @returns {User|null} Current user or null
   */
  getCurrentUser() {
    return this.state.user;
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, user?: User, error?: string}>}
   */
  async login(email, password) {
    try {
      // Show loading spinner
      showLoadingSpinner();

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic
      const mockUsers = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'student@university.edu',
          password: 'password123',
          role: 'student'
        },
        {
          id: '2',
          name: 'Sarah Williams',
          email: 'sarah@university.edu',
          password: 'password123',
          role: 'student'
        }
      ];

      const user = mockUsers.find(u => u.email === email && u.password === password);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        
        this.state = {
          isAuthenticated: true,
          user: userWithoutPassword,
          token: this.generateToken(userWithoutPassword)
        };

        this.saveToStorage();
        this.notifyListeners();

        hideLoadingSpinner();
        return { success: true, user: userWithoutPassword };
      } else {
        hideLoadingSpinner();
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      hideLoadingSpinner();
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Log out current user
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async logout() {
    try {
      showLoadingSpinner();

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.state = {
        isAuthenticated: false,
        user: null,
        token: null
      };

      this.saveToStorage();
      this.notifyListeners();

      hideLoadingSpinner();
      return { success: true };
    } catch (error) {
      hideLoadingSpinner();
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  }

  /**
   * Generate mock authentication token
   * @param {User} user - User object
   * @returns {string} Generated token
   * @private
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  /**
   * Validate token
   * @param {string} token - Token to validate
   * @returns {boolean} True if token is valid
   * @private
   */
  validateToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.add('spinner--active');
  }
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.remove('spinner--active');
  }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthManager, authManager };
} else {
  window.AuthManager = AuthManager;
  window.authManager = authManager;
}
