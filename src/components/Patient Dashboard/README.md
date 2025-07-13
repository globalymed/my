# Patient Dashboard - Material UI Implementation

## Overview
The patient dashboard has been converted to use Material UI components, providing a modern, responsive, and accessible user interface for patients to manage their medical appointments and information.

## Features

### 🏠 Home Overview
- Welcome message with user's name
- Upcoming appointment display
- Treatment progress tracking
- Quick access to key features

### 📅 Appointments Management
- View upcoming appointments
- View past appointments
- Appointment details with doctor and hospital information
- Join call and reschedule options

### 📄 Documents Vault
- Secure document storage
- Upload and download functionality
- Document categorization (Medical, Travel, Insurance)
- Search and filter capabilities

### 👤 Profile Management
- Personal information editing
- Medical information storage
- Travel documents management
- Privacy and access controls

### 🔔 Notifications
- Real-time notification system
- Badge indicators for unread notifications

## Components Structure

### Main Components
- `MediyatraDashboard` - Main dashboard container
- `AppSidebar` - Navigation sidebar with Material UI icons
- `HomeOverview` - Dashboard home page
- `AppointmentsSection` - Appointment management
- `DocumentsSection` - Document management
- `ProfileSection` - User profile management

### Material UI Integration
- **Theme**: Custom Material UI theme with primary/secondary colors
- **Layout**: Responsive grid system with breakpoints
- **Navigation**: Material UI Drawer with List components
- **Cards**: Information display using Material UI Cards
- **Forms**: TextField, Select, and other form components
- **Feedback**: Loading states, error handling, and notifications

## Usage

### DashboardPage.js Integration
```javascript
import { MediyatraDashboard } from "./Patient Dashboard/mediyatra-dashboard";

// Pass user data, appointments, and handlers
<MediyatraDashboard
  user={user}
  appointments={appointments}
  onLogout={handleLogout}
  error={error}
  loading={loading}
/>
```

### Props
- `user`: User object with profile information
- `appointments`: Array of appointment objects
- `onLogout`: Function to handle user logout
- `error`: Error message string (optional)
- `loading`: Boolean for loading state

## Styling
- Uses Material UI's `sx` prop for custom styling
- Responsive design with Material UI breakpoints
- Consistent spacing using Material UI spacing system
- Color scheme follows Material UI palette

## Dependencies
- `@mui/material` - Core Material UI components
- `@mui/icons-material` - Material UI icons
- `@emotion/react` - CSS-in-JS styling
- `@emotion/styled` - Styled components

## Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Responsive grid layouts
- Touch-friendly interface elements

## Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Focus management

## Future Enhancements
- Real-time chat integration
- Video call functionality
- Document upload with drag-and-drop
- Advanced filtering and search
- Dark mode support
- Multi-language support 