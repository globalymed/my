# MediYatra App with Doctor Dashboard Integration

This project integrates the main MediYatra patient-facing application with the Doctor Dashboard (patient-dashboard-ai) for healthcare providers.

## Features

- AI-powered medical chat for patients
- Clinic recommendation system
- Appointment booking system
- Patient management
- Doctor Dashboard for healthcare providers

## Integration Setup

The Doctor Dashboard is integrated as a separate application that can be accessed from the main application's navigation.

### Development Setup

#### Option 1: Separate Development Servers (for active development of both apps)

1. Install dependencies for the main application:
   ```bash
   npm install
   ```

2. Install dependencies for the Doctor Dashboard:
   ```bash
   cd patient-dashboard-ai
   npm install
   ```

3. Run the main application in development mode:
   ```bash
   npm run dev
   ```

4. In a separate terminal, run the Doctor Dashboard in development mode:
   ```bash
   cd patient-dashboard-ai
   npm run dev
   ```

#### Option 2: Integrated Development (for testing the integration)

1. Install dependencies for both applications:
   ```bash
   npm install && cd patient-dashboard-ai && npm install && cd ..
   ```

2. Set up the development environment:
   ```bash
   npm run setup-dev
   ```

3. Run the main application:
   ```bash
   npm start
   ```

The Doctor Dashboard will be available at `/doctor-dashboard` within the main application.

### Production Deployment

To build both applications for production:

```bash
npm run deploy:all
```

This script will:
1. Install dependencies for both applications
2. Build the Doctor Dashboard
3. Copy the built files to the main application's public folder
4. Build the main application

The Doctor Dashboard will be accessible at `/doctor-dashboard` after deployment.

## Environment Configuration

Both applications require their own environment configurations:

- Main application: `.env` or `.env.local` file in the root directory
- Doctor Dashboard: `.env` or `.env.local` file in the `patient-dashboard-ai` directory

## Navigation

The Doctor Dashboard can be accessed by clicking the "Doctor Dashboard" button in the main navigation menu.

## API Integration

Both applications share the same backend services but have separate front-end codebases.

## Troubleshooting

If you encounter issues with the integration:

1. Ensure both applications have their dependencies installed
2. For development, run `npm run setup-dev` to ensure the Doctor Dashboard files are copied correctly
3. Check the browser console for any errors related to loading resources
4. If the Doctor Dashboard is not loading correctly, check that the iframe is pointing to the correct path
5. Try clearing your browser cache and reloading the page 