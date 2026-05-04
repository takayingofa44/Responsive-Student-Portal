# Student Portal Web Application

A high-fidelity, responsive student portal built with a mobile-first design philosophy using semantic HTML5, CSS3, and vanilla JavaScript.

## Features

### 🔐 Authentication System
- **Glassmorphism Login UI**: Sleek, centered login interface with backdrop blur effects
- **State-Based Authentication**: JavaScript-driven auth state management without page refreshes
- **Mock User System**: Pre-configured test accounts for demonstration

### 📊 Dynamic Dashboard
- **Responsive Sidebar Navigation**: Collapsible mobile menu with smooth transitions
- **Personalized Greeting**: Dynamic user welcome with real-time timestamp
- **Course Progress Cards**: Visual progress bars with CSS animations
- **Interactive Grade Table**: Sortable data table with visual grade badges
- **Quick Actions**: Hover-enabled action buttons for common tasks

### 🎨 UI/UX Features
- **Dark/Light Mode Toggle**: Theme persistence with localStorage
- **Responsive Design**: Fully functional on Mobile (390px), Tablet (768px), and Desktop (1440px)
- **Micro-interactions**: Subtle scale effects, loading spinners, and smooth transitions
- **Professional Color Palette**: Deep blues, slate greys, and electric blue accents

## Technical Implementation

### Architecture
- **Component-Based Structure**: Modular separation of concerns
- **State Management**: Centralized app state and auth state management
- **Event-Driven Programming**: Comprehensive event handling and listeners

### Technologies Used
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern Flexbox/Grid layouts, CSS Variables, BEM naming conventions
- **JavaScript ES6+**: JSDoc documentation, async/await, modern class syntax

### File Structure
```
├── index.html          # Main HTML structure
├── style.css           # Complete styling with responsive design
├── auth.js             # Authentication state management
├── app.js              # Main application controller
└── README.md           # Project documentation
```

## Usage

### Login Credentials
Use any of these test accounts:
- **Email**: `student@university.edu` | **Password**: `password123`
- **Email**: `sarah@university.edu` | **Password**: `password123`

### Features Demonstration
1. **Login**: Enter credentials to see the glassmorphism effects and loading spinner
2. **Dashboard**: Explore course progress, grades, and quick actions
3. **Theme Toggle**: Click the moon/sun icon to switch between themes
4. **Sorting**: Click table headers to sort grades by assignment, course, grade, or date
5. **Responsive**: Resize browser to see mobile/tablet/desktop layouts

## Responsive Breakpoints

- **Mobile**: 390px and below - Single column layout, hamburger menu
- **Tablet**: 768px and below - Adjusted grid layouts, touch-friendly interactions
- **Desktop**: 1440px and above - Full multi-column layout with sidebar

## Code Quality

- **JSDoc Documentation**: Comprehensive code documentation
- **BEM CSS Naming**: Maintainable CSS class structure
- **Error Handling**: Graceful error states and user feedback
- **Performance**: Optimized animations and efficient DOM manipulation
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## Browser Compatibility

Built with modern web standards and tested for compatibility with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

This application demonstrates professional frontend development practices including:
- Component-based architecture
- State management patterns
- Responsive design principles
- Modern CSS techniques
- Clean JavaScript patterns
- User experience optimization
