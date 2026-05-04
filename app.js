/**
 * Student Portal Application
 * Main application controller that manages UI state and interactions
 * @author Student Portal Team
 * @version 1.0.0
 */

/**
 * @typedef {Object} Course
 * @property {string} id - Course ID
 * @property {string} name - Course name
 * @property {string} instructor - Instructor name
 * @property {number} progress - Progress percentage (0-100)
 */

/**
 * @typedef {Object} Grade
 * @property {string} id - Grade ID
 * @property {string} assignment - Assignment name
 * @property {string} course - Course name
 * @property {string} grade - Letter grade
 * @property {string} date - Date string
 */

/**
 * @typedef {Object} AppState
 * @property {string} currentView - Current view ('login' or 'dashboard')
 * @property {Course[]} courses - Array of courses
 * @property {Grade[]} grades - Array of grades
 * @property {string} theme - Current theme ('light' or 'dark')
 */

/**
 * Main application controller
 */
class StudentPortalApp {
  /**
   * Create a StudentPortalApp instance
   */
  constructor() {
    this.state = {
      currentView: 'login',
      courses: [],
      grades: [],
      theme: 'light'
    };
    this.sortConfig = {
      key: null,
      direction: 'asc'
    };
    this.initializeApp();
  }

  /**
   * Initialize the application
   * @private
   */
  initializeApp() {
    this.loadTheme();
    this.loadMockData();
    this.setupEventListeners();
    this.setupAuthListener();
    this.updateUI();
  }

  /**
   * Load theme preference from localStorage
   * @private
   */
  loadTheme() {
    try {
      const savedTheme = localStorage.getItem('studentPortalTheme') || 'light';
      this.state.theme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateThemeToggle();
    } catch (error) {
      console.warn('Failed to load theme:', error);
    }
  }

  /**
   * Load mock data for courses and grades
   * @private
   */
  loadMockData() {
    this.state.courses = [
      {
        id: '1',
        name: 'Computer Science 101',
        instructor: 'Dr. Sarah Chen',
        progress: 75
      },
      {
        id: '2',
        name: 'Mathematics 202',
        instructor: 'Prof. Michael Roberts',
        progress: 60
      },
      {
        id: '3',
        name: 'Physics 150',
        instructor: 'Dr. Emily Watson',
        progress: 85
      },
      {
        id: '4',
        name: 'English Literature',
        instructor: 'Prof. James Miller',
        progress: 90
      }
    ];

    this.state.grades = [
      {
        id: '1',
        assignment: 'Midterm Exam',
        course: 'Computer Science 101',
        grade: 'A',
        date: '2024-04-15'
      },
      {
        id: '2',
        assignment: 'Lab Report #3',
        course: 'Physics 150',
        grade: 'B+',
        date: '2024-04-12'
      },
      {
        id: '3',
        assignment: 'Problem Set 5',
        course: 'Mathematics 202',
        grade: 'A-',
        date: '2024-04-10'
      },
      {
        id: '4',
        assignment: 'Essay Assignment',
        course: 'English Literature',
        grade: 'A',
        date: '2024-04-08'
      },
      {
        id: '5',
        assignment: 'Quiz #2',
        course: 'Computer Science 101',
        grade: 'B',
        date: '2024-04-05'
      }
    ];
  }

  /**
   * Setup event listeners
   * @private
   */
  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', this.handleLogout.bind(this));
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // Grade table sorting
    const sortableHeaders = document.querySelectorAll('.grades-table__header--sortable');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', () => this.handleSort(header));
    });

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
      button.addEventListener('click', this.handleQuickAction.bind(this));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      
      if (sidebar && mobileMenuToggle && 
          !sidebar.contains(e.target) && 
          !mobileMenuToggle.contains(e.target) &&
          sidebar.classList.contains('sidebar--open')) {
        sidebar.classList.remove('sidebar--open');
      }
    });
  }

  /**
   * Setup authentication state listener
   * @private
   */
  setupAuthListener() {
    if (window.authManager) {
      authManager.addListener(this.handleAuthStateChange.bind(this));
    }
  }

  /**
   * Handle authentication state changes
   * @param {Object} authState - Current authentication state
   * @private
   */
  handleAuthStateChange(authState) {
    if (authState.isAuthenticated) {
      this.state.currentView = 'dashboard';
      this.updateUI();
      this.startTimestampUpdate();
    } else {
      this.state.currentView = 'login';
      this.updateUI();
      this.stopTimestampUpdate();
    }
  }

  /**
   * Handle login form submission
   * @param {Event} event - Form submit event
   * @private
   */
  async handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (window.authManager) {
      const result = await authManager.login(email, password);
      
      if (!result.success) {
        this.showNotification(result.error || 'Login failed', 'error');
      }
    }
  }

  /**
   * Handle logout
   * @private
  */
  async handleLogout() {
    if (window.authManager) {
      const result = await authManager.logout();
      
      if (!result.success) {
        this.showNotification(result.error || 'Logout failed', 'error');
      }
    }
  }

  /**
   * Handle theme toggle
   * @private
   */
  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.state.theme = newTheme;
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('studentPortalTheme', newTheme);
    
    this.updateThemeToggle();
  }

  /**
   * Update theme toggle button
   * @private
   */
  updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = this.state.theme === 'light' ? '🌙' : '☀️';
      }
    }
  }

  /**
   * Handle mobile menu toggle
   * @private
   */
  toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('sidebar--open');
    }
  }

  /**
   * Handle grade table sorting
   * @param {HTMLElement} header - Clicked header element
   * @private
   */
  handleSort(header) {
    const sortKey = header.dataset.sort;
    
    if (this.sortConfig.key === sortKey) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = sortKey;
      this.sortConfig.direction = 'asc';
    }

    this.sortGrades();
    this.renderGradesTable();
    this.updateSortIndicators();
  }

  /**
   * Sort grades based on current sort configuration
   * @private
   */
  sortGrades() {
    const { key, direction } = this.sortConfig;
    
    this.state.grades.sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      
      // Handle grade sorting with letter grades
      if (key === 'grade') {
        const gradeOrder = { 'A+': 4.0, 'A': 3.7, 'A-': 3.3, 'B+': 3.0, 'B': 2.7, 'B-': 2.3, 'C+': 2.0, 'C': 1.7, 'D': 1.0, 'F': 0.0 };
        aVal = gradeOrder[aVal] || 0;
        bVal = gradeOrder[bVal] || 0;
      }
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Update sort indicators in table headers
   * @private
   */
  updateSortIndicators() {
    const headers = document.querySelectorAll('.grades-table__header--sortable');
    headers.forEach(header => {
      const indicator = header.querySelector('.sort-indicator');
      if (indicator) {
        if (header.dataset.sort === this.sortConfig.key) {
          indicator.textContent = this.sortConfig.direction === 'asc' ? '↑' : '↓';
        } else {
          indicator.textContent = '↕';
        }
      }
    });
  }

  /**
   * Handle quick action button clicks
   * @param {Event} event - Click event
   * @private
   */
  handleQuickAction(event) {
    const button = event.currentTarget;
    const actionText = button.querySelector('.action-button__text').textContent;
    
    this.showNotification(`${actionText} feature coming soon!`, 'info');
  }

  /**
   * Show notification message
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('info', 'success', 'error')
   * @private
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      opacity: '0',
      transform: 'translateY(-20px)',
      transition: 'all 0.3s ease-in-out'
    });

    // Set background color based on type
    const colors = {
      info: '#06b6d4',
      success: '#10b981',
      error: '#ef4444'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Update UI based on current state
   * @private
   */
  updateUI() {
    const loginContainer = document.getElementById('loginContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');

    if (this.state.currentView === 'login') {
      loginContainer.style.display = 'flex';
      dashboardContainer.style.display = 'none';
    } else {
      loginContainer.style.display = 'none';
      dashboardContainer.style.display = 'grid';
      this.renderDashboard();
    }
  }

  /**
   * Render dashboard content
   * @private
   */
  renderDashboard() {
    this.updateUserGreeting();
    this.renderCourseCards();
    this.renderGradesTable();
  }

  /**
   * Update user greeting with current user data
   * @private
   */
  updateUserGreeting() {
    const user = authManager?.getCurrentUser();
    const studentNameElement = document.getElementById('studentName');
    
    if (user && studentNameElement) {
      studentNameElement.textContent = user.name;
    }
  }

  /**
   * Render course progress cards
   * @private
   */
  renderCourseCards() {
    const courseGrid = document.getElementById('courseGrid');
    if (!courseGrid) return;

    courseGrid.innerHTML = '';

    this.state.courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      
      card.innerHTML = `
        <h3 class="course-card__title">${course.name}</h3>
        <p class="course-card__instructor">${course.instructor}</p>
        <div class="progress-bar">
          <div class="progress-bar__label">
            <span>Progress</span>
            <span>${course.progress}%</span>
          </div>
          <div class="progress-bar__track">
            <div class="progress-bar__fill" style="width: ${course.progress}%"></div>
          </div>
        </div>
      `;

      courseGrid.appendChild(card);
    });
  }

  /**
   * Render grades table
   * @private
   */
  renderGradesTable() {
    const tableBody = document.getElementById('gradesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    this.state.grades.forEach(grade => {
      const row = document.createElement('tr');
      row.className = 'grades-table__row';
      
      const gradeClass = this.getGradeBadgeClass(grade.grade);
      
      row.innerHTML = `
        <td class="grades-table__cell">${grade.assignment}</td>
        <td class="grades-table__cell">${grade.course}</td>
        <td class="grades-table__cell">
          <span class="grade-badge grade-badge--${gradeClass}">${grade.grade}</span>
        </td>
        <td class="grades-table__cell">${this.formatDate(grade.date)}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  /**
   * Get CSS class for grade badge
   * @param {string} grade - Letter grade
   * @returns {string} CSS class name
   * @private
   */
  getGradeBadgeClass(grade) {
    const firstLetter = grade.charAt(0).toUpperCase();
    if (firstLetter === 'A') return 'a';
    if (firstLetter === 'B') return 'b';
    if (firstLetter === 'C') return 'c';
    if (firstLetter === 'D') return 'd';
    return 'd';
  }

  /**
   * Format date string
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {string} Formatted date
   * @private
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Start timestamp updates
   * @private
  */
  startTimestampUpdate() {
    this.updateTimestamp();
    this.timestampInterval = setInterval(() => this.updateTimestamp(), 60000); // Update every minute
  }

  /**
   * Stop timestamp updates
   * @private
  */
  stopTimestampUpdate() {
    if (this.timestampInterval) {
      clearInterval(this.timestampInterval);
      this.timestampInterval = null;
    }
  }

  /**
   * Update timestamp display
   * @private
   */
  updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      timestampElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new StudentPortalApp();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StudentPortalApp;
}
